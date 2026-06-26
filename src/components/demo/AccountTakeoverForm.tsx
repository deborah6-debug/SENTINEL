import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertTriangle, Shield, Clock, MapPin, Wifi } from "lucide-react";

const formSchema = z.object({
  // Account
  user_id: z.string().min(1, "Account ID is required"),
  
  // Transaction
  amount: z.coerce.number().positive("Amount must be positive"),
  transaction_type: z.enum(["withdrawal", "transfer", "deposit"]),
  payment_channel: z.enum(["card", "ACH", "wire_transfer"]),
  
  // Session Signals
  device_used: z.enum(["mobile", "atm", "pos", "online"]),
  location: z.string().min(1, "Location is required"),
  ip_address: z.string().regex(
  /^(\d{1,3}\.){3}\d{1,3}$/,
  "Invalid IP address"
),
  timestamp: z.string().min(1, "Timestamp is required"),
  
  // Behavioral Scores
  time_since_last_transaction: z.coerce.number().min(0, "Must be 0 or greater"),
  spending_deviation_score: z.coerce.number().min(-5).max(5, "Must be between -5 and 5"),
  velocity_score: z.coerce.number().min(0).max(100, "Must be between 0 and 100"),
  geo_anomaly_score: z.coerce.number().min(0).max(1, "Must be between 0 and 1"),
});

type FormData = z.infer<typeof formSchema>;

interface AccountTakeoverFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export function AccountTakeoverForm({ onSubmit, isLoading }: AccountTakeoverFormProps) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: "acct_9b21c",
      amount: 4500.00,
      transaction_type: "transfer",
      payment_channel: "wire_transfer",
      device_used: "online",
      location: "Lagos, Nigeria",
      ip_address: "185.220.101.4",
      timestamp: "2026-06-25T04:12",
      time_since_last_transaction: 120,
      spending_deviation_score: 3.2,
      velocity_score: 78,
      geo_anomaly_score: 0.85,
    },
  });

  const deviceUsed = watch("device_used");
  const transactionType = watch("transaction_type");
  const geoAnomaly = watch("geo_anomaly_score");
  const velocityScore = watch("velocity_score");

  // Warning conditions
  const showDeviceWarning = deviceUsed === "online" || deviceUsed === "atm";
  const showChannelWarning = transactionType === "transfer" && watch("payment_channel") === "wire_transfer";
  const showGeoWarning = geoAnomaly > 0.6;
  const showVelocityWarning = velocityScore > 70;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h3 className="text-sm font-medium text-gray-300">Account Takeover Analysis</h3>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-gray-500">Session-based detection</span>
        </div>
      </div>

      {/* Section: Account Info */}
      <div className="space-y-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Account</p>
        <div>
          <Label className="text-gray-400 text-xs uppercase">Account ID</Label>
          <Input 
            {...register("user_id")} 
            className="bg-black/40 border-white/10 text-white mt-1 font-mono text-sm"
          />
          {errors.user_id && (
            <p className="text-red-400 text-xs mt-1">{errors.user_id.message}</p>
          )}
        </div>
      </div>

      {/* Section: Transaction Details */}
      <div className="space-y-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Transaction</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-400 text-xs uppercase">Amount ($)</Label>
            <Input 
              {...register("amount")} 
              type="number" 
              step="0.01"
              className="bg-black/40 border-white/10 text-white mt-1"
            />
            {errors.amount && (
              <p className="text-red-400 text-xs mt-1">{errors.amount.message}</p>
            )}
          </div>
          <div>
            <Label className="text-gray-400 text-xs uppercase">Transaction Type</Label>
            <Select 
              onValueChange={(value) => setValue("transaction_type", value as any)}
              defaultValue="transfer"
            >
              <SelectTrigger className="bg-black/40 border-white/10 text-white mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10">
                <SelectItem value="withdrawal">💰 Withdrawal</SelectItem>
                <SelectItem value="transfer">🔄 Transfer</SelectItem>
                <SelectItem value="deposit">📥 Deposit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-gray-400 text-xs uppercase">Payment Channel</Label>
          <Select 
            onValueChange={(value) => setValue("payment_channel", value as any)}
            defaultValue="wire_transfer"
          >
            <SelectTrigger className="bg-black/40 border-white/10 text-white mt-1">
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-white/10">
              <SelectItem value="card">💳 Card</SelectItem>
              <SelectItem value="ACH">🏦 ACH</SelectItem>
              <SelectItem value="wire_transfer">🌐 Wire Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Section: Session Signals */}
      <div className="space-y-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Session Signals</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-400 text-xs uppercase">Device</Label>
            <Select 
              onValueChange={(value) => setValue("device_used", value as any)}
              defaultValue="online"
            >
              <SelectTrigger className={`bg-black/40 border-white/10 text-white mt-1 ${
                showDeviceWarning ? "border-yellow-500/50" : ""
              }`}>
                <SelectValue placeholder="Select device" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10">
                <SelectItem value="mobile">📱 Mobile</SelectItem>
                <SelectItem value="atm">🏧 ATM</SelectItem>
                <SelectItem value="pos">💳 POS</SelectItem>
                <SelectItem value="online">💻 Online</SelectItem>
              </SelectContent>
            </Select>
            {showDeviceWarning && (
              <p className="text-yellow-400 text-xs mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                High-risk device type
              </p>
            )}
          </div>
          <div>
            <Label className="text-gray-400 text-xs uppercase">Location (City)</Label>
            <Input 
              {...register("location")} 
              className="bg-black/40 border-white/10 text-white mt-1"
            />
            {errors.location && (
              <p className="text-red-400 text-xs mt-1">{errors.location.message}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-400 text-xs uppercase flex items-center gap-1">
              <Wifi className="w-3 h-3" />
              IP Address
            </Label>
            <Input 
              {...register("ip_address")} 
              className="bg-black/40 border-white/10 text-white mt-1 font-mono text-sm"
            />
            {errors.ip_address && (
              <p className="text-red-400 text-xs mt-1">{errors.ip_address.message}</p>
            )}
          </div>
          <div>
            <Label className="text-gray-400 text-xs uppercase flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Timestamp
            </Label>
            <Input 
              {...register("timestamp")} 
              type="datetime-local"
              className="bg-black/40 border-white/10 text-white mt-1"
            />
            {errors.timestamp && (
              <p className="text-red-400 text-xs mt-1">{errors.timestamp.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Section: Behavioral Scores */}
      <div className="space-y-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Behavioral Signals</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-400 text-xs uppercase">Time Since Last Transaction (s)</Label>
            <Input 
              {...register("time_since_last_transaction")} 
              type="number"
              className="bg-black/40 border-white/10 text-white mt-1"
            />
            {errors.time_since_last_transaction && (
              <p className="text-red-400 text-xs mt-1">{errors.time_since_last_transaction.message}</p>
            )}
          </div>
          <div>
            <Label className="text-gray-400 text-xs uppercase">Spending Deviation Score</Label>
            <Input 
              {...register("spending_deviation_score")} 
              type="number" 
              step="0.1"
              className={`bg-black/40 border-white/10 text-white mt-1 ${
                watch("spending_deviation_score") > 3 ? "border-yellow-500/50" : ""
              }`}
            />
            {errors.spending_deviation_score && (
              <p className="text-red-400 text-xs mt-1">{errors.spending_deviation_score.message}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-400 text-xs uppercase">Velocity Score</Label>
            <Input 
              {...register("velocity_score")} 
              type="number"
              className={`bg-black/40 border-white/10 text-white mt-1 ${
                showVelocityWarning ? "border-yellow-500/50" : ""
              }`}
            />
            {errors.velocity_score && (
              <p className="text-red-400 text-xs mt-1">{errors.velocity_score.message}</p>
            )}
            {showVelocityWarning && (
              <p className="text-yellow-400 text-xs mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                High velocity - possible automation
              </p>
            )}
          </div>
          <div>
            <Label className="text-gray-400 text-xs uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Geo Anomaly Score
            </Label>
            <Input 
              {...register("geo_anomaly_score")} 
              type="number" 
              step="0.01"
              className={`bg-black/40 border-white/10 text-white mt-1 ${
                showGeoWarning ? "border-red-500/50" : ""
              }`}
            />
            {errors.geo_anomaly_score && (
              <p className="text-red-400 text-xs mt-1">{errors.geo_anomaly_score.message}</p>
            )}
            {showGeoWarning && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Unusual location detected
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Combined Risk Summary */}
      {(showDeviceWarning || showChannelWarning || showGeoWarning || showVelocityWarning) && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 space-y-1">
          <p className="text-sm text-red-400 font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Multiple risk indicators detected
          </p>
          <ul className="text-xs text-red-400/70 space-y-0.5 list-disc list-inside">
            {showDeviceWarning && <li>High-risk device type</li>}
            {showChannelWarning && <li>Wire transfer after login</li>}
            {showGeoWarning && <li>Geographic anomaly</li>}
            {showVelocityWarning && <li>Unusual transaction speed</li>}
          </ul>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          "🚀 Run ATO Analysis"
        )}
      </Button>
    </form>
  );
}