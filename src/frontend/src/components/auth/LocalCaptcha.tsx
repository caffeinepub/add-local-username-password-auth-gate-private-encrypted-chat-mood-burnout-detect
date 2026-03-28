import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface LocalCaptchaProps {
  onVerify: (isValid: boolean) => void;
  regenerateTrigger?: number;
}

export default function LocalCaptcha({
  onVerify,
  regenerateTrigger: _regenerateTrigger = 0,
}: LocalCaptchaProps) {
  const [challenge, setChallenge] = useState({ num1: 0, num2: 0, answer: 0 });
  const [userAnswer, setUserAnswer] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const generateChallenge = useCallback(() => {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    setChallenge({ num1, num2, answer: num1 + num2 });
    setUserAnswer("");
    setIsVerified(false);
    onVerify(false);
  }, [onVerify]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: _regenerateTrigger is an intentional trigger prop
  useEffect(() => {
    generateChallenge();
  }, [generateChallenge, _regenerateTrigger]);

  const handleVerify = () => {
    const isValid = Number.parseInt(userAnswer) === challenge.answer;
    setIsVerified(isValid);
    onVerify(isValid);
  };

  const handleInputChange = (value: string) => {
    setUserAnswer(value);
    if (isVerified) {
      setIsVerified(false);
      onVerify(false);
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-lg bg-secondary/30 border border-border/50">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Security Check</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={generateChallenge}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 text-center p-3 bg-background/50 rounded-lg border border-border/30">
          <span className="text-lg font-mono font-semibold">
            {challenge.num1} + {challenge.num2} = ?
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          type="number"
          value={userAnswer}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter answer"
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleVerify}
          disabled={!userAnswer}
          variant={isVerified ? "default" : "outline"}
        >
          {isVerified ? "Verified ✓" : "Verify"}
        </Button>
      </div>
    </div>
  );
}
