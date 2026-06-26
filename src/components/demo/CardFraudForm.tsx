import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  currency: z.string().length(3, "3-letter currency code"),
  merchant: z.string().min(1, "Merchant is required"),
  mcc: z.string().optional(),
  card_last4: z.string().length(4, "Last 4 digits only"),
  bin_country: z.string().length(2, "Country code (e.g., US)"),
  ip_country: z.string().length(2, "Country code (e.g., US)"),
  ip_type: z.string().optional(),
  billing_country: z.string().optional(),
  shipping_country: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function CardFraudForm({ 
  onSubmit, 
  isLoading 
}: { 
  onSubmit: (data: FormData) => void; 
  isLoading: boolean;
}) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 1299,
      currency: "USD",
      merchant: "GiftCardHub.io",
      mcc: "5499 - Gift cards (high risk)",
      card_last4: "4242",
      bin_country: "US",
      ip_country: "NG",
      ip_type: "Datacenter",
      billing_country: "US",
      shipping_country: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-muted-foreground text-xs uppercase">Amount</Label>
          <Input 
            {...register("amount")} 
            type="number" 
            step="0.01" 
            className="bg-muted/50 border-border text-foreground mt-1"
          />
          {errors.amount && (
            <p className="text-red-400 text-xs mt-1">{errors.amount.message}</p>
          )}
        </div>
        <div>
          <Label className="text-muted-foreground text-xs uppercase">Currency</Label>
          <Input 
            {...register("currency")} 
            className="bg-muted/50 border-border text-foreground mt-1"
          />
          {errors.currency && (
            <p className="text-red-400 text-xs mt-1">{errors.currency.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label className="text-muted-foreground text-xs uppercase">Merchant</Label>
        <Input 
          {...register("merchant")} 
          className="bg-muted/50 border-border text-foreground mt-1"
        />
        {errors.merchant && (
          <p className="text-red-400 text-xs mt-1">{errors.merchant.message}</p>
        )}
      </div>

      <div>
        <Label className="text-muted-foreground text-xs uppercase">MCC / Category</Label>
        <Input 
          {...register("mcc")} 
          className="bg-muted/50 border-border text-muted-foreground mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-muted-foreground text-xs uppercase">Card last 4</Label>
          <Input 
            {...register("card_last4")} 
            className="bg-muted/50 border-border text-foreground mt-1"
          />
          {errors.card_last4 && (
            <p className="text-red-400 text-xs mt-1">{errors.card_last4.message}</p>
          )}
        </div>
        <div>
          <Label className="text-muted-foreground text-xs uppercase">Card BIN country</Label>
          <Input 
            {...register("bin_country")} 
            className="bg-muted/50 border-border text-foreground mt-1"
          />
          {errors.bin_country && (
            <p className="text-red-400 text-xs mt-1">{errors.bin_country.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-muted-foreground text-xs uppercase">IP country</Label>
          <Input 
            {...register("ip_country")} 
            className="bg-muted/50 border-border text-foreground mt-1"
          />
          {errors.ip_country && (
            <p className="text-red-400 text-xs mt-1">{errors.ip_country.message}</p>
          )}
        </div>
        <div>
          <Label className="text-muted-foreground text-xs uppercase">IP type</Label>
          <Input 
            {...register("ip_type")} 
            className="bg-muted/50 border-border text-muted-foreground mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-muted-foreground text-xs uppercase">Billing country</Label>
          <Input 
            {...register("billing_country")} 
            className="bg-muted/50 border-border text-foreground mt-1"
          />
        </div>
        <div>
          <Label className="text-muted-foreground text-xs uppercase">Shipping country</Label>
          <Input 
            {...register("shipping_country")} 
            className="bg-muted/50 border-border text-foreground mt-1"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          "🚀 Run analysis"
        )}
      </Button>
    </form>
  );
}