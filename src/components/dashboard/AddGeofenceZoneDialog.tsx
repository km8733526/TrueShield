
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(1, "Zone name is required"),
  radius: z.number().min(100, "Minimum radius is 100 meters").max(5000, "Maximum radius is 5000 meters"),
});

type FormData = z.infer<typeof formSchema>;

interface AddGeofenceZoneDialogProps {
  onSubmit: (data: { name: string; radius: number }) => void;
  disabled?: boolean;
}

export const AddGeofenceZoneDialog = ({ onSubmit, disabled }: AddGeofenceZoneDialogProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      radius: 500,
    },
  });

  const handleSubmit = (data: FormData) => {
    // Explicitly type the data to match the expected input
    const submissionData = {
      name: data.name,
      radius: data.radius
    };
    onSubmit(submissionData);
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className="w-full"
          disabled={disabled}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Safe Zone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Add New Safe Zone
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Home" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="radius"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Radius (meters)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="500"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Create Zone
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
