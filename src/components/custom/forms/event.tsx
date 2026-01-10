import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { months } from "@/constants/months";
import { client } from "@/lib/orpc/orpc";
import { buildImageUrl } from "@/lib/utils";
import { TEventSchema } from "@/schema/event";
import { TFormProps } from "@/types/form-props";
import { safe } from "@orpc/client";
import { ImageIcon, ImagePlusIcon, Loader2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useWatch } from "react-hook-form";
import { toast } from "sonner";

export default function EventForm({
  form,
  onSubmit,
}: TFormProps<TEventSchema>) {
  const avatar = useWatch({ control: form.control, name: "avatar" });
  const imageRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleDeleteAvatar = (e: PointerEvent) => {
    form.setValue("avatar", "");
    e.stopPropagation();
  };

  useEffect(() => {
    const controller = new AbortController();

    const ref = imageRef.current;
    if (!ref) return;

    const handleChange = async (ev: Event) => {
      const target = ev.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      setUploading(true);

      const mimetype = file?.type ?? "image/jpeg";
      const [err, res] = await safe(
        client.url.generate.getEventUserAvatarUrl({
          mimetype,
        })
      );

      if (err) {
        throw new Error(err.message);
      }

      await fetch(res.url, {
        method: "PUT",
        headers: {
          "Content-Type": mimetype,
        },
        body: file,
      });
      form.setValue("avatar", res.path);
    };

    ref.addEventListener(
      "change",
      async (ev) => {
        handleChange(ev)
          .catch((e) => {
            toast.error((e as Error).message);
          })
          .finally(() => {
            setUploading(false);
            if (imageRef.current) {
              imageRef.current.value = "";
            }
          });
      },
      { signal: controller.signal }
    );

    return () => controller.abort();
  }, [avatar]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <section className="flex justify-center">
          <input ref={imageRef} hidden type="file" />
          <div
            className="size-20 border rounded-lg flex justify-center items-center relative"
            onClick={() => imageRef.current?.click()}
          >
            {avatar ? (
              <img
                src={buildImageUrl(avatar)}
                className="size-full object-contain"
              />
            ) : uploading ? (
              <Loader2
                size={16}
                className="animate-spin text-muted-foreground"
              />
            ) : (
              <ImagePlusIcon className="text-muted-foreground" size={16} />
            )}
            <Button
              type="button"
              size={"icon"}
              variant={"destructive"}
              className="rounded-full size-6 absolute top-0.5 right-0.5"
              hidden={!avatar}
            >
              <Trash2 size={12} className="scale-90" />
            </Button>
          </div>
        </section>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Arijit Das" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  className="field-sizing-content max-h-28 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="91 70042 90001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp</FormLabel>
              <FormControl>
                <Input placeholder="91 70042 90001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Month</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select month" {...field} />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.id} value={month.id.toString()}>
                          {month.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="day"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Month</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1 - 31" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            "Create Event"
          )}
        </Button>
      </form>
    </Form>
  );
}
