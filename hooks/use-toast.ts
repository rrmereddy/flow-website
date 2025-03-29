import { toast } from "sonner"

export const useToast = () => {
  return {
    toast: (props: { title: string; description?: string; variant?: "destructive" }) => {
      toast(props.title, {
        description: props.description,
        className: props.variant === "destructive" ? "bg-destructive text-destructive-foreground" : undefined,
      })
    },
  }
} 