import { ReactNode } from "react";
import FullscreenImage from "./FullscreenImage";

interface FormStepProps {
  backgroundImage: string;
  stepNumber: number;
  totalSteps: number;
  question: string;
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  showBack?: boolean;
  nextLabel?: string;
  isValid?: boolean;
}

const FormStep = ({
  backgroundImage,
  stepNumber,
  totalSteps,
  question,
  children,
  onNext,
  onBack,
  showBack = true,
  nextLabel = "Próximo",
  isValid = true,
}: FormStepProps) => {
  return (
    <FullscreenImage src={backgroundImage} alt={`Step ${stepNumber}`}>
      <div className="w-full max-w-lg animate-slide-up">
        {/* Progress indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 w-8 rounded-full transition-all duration-300 ${
                i < stepNumber
                  ? "bg-primary box-glow-pink"
                  : i === stepNumber
                  ? "bg-secondary box-glow-cyan"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step number */}
        <div className="mb-4 text-center">
          <span className="text-sm uppercase tracking-widest text-secondary text-glow-cyan">
            Passo {stepNumber + 1} de {totalSteps}
          </span>
        </div>

        {/* Question */}
        <h2 className="mb-8 text-center text-2xl font-bold uppercase tracking-wide text-foreground md:text-3xl">
          {question}
        </h2>

        {/* Input area */}
        <div className="mb-8">{children}</div>

        {/* Navigation buttons */}
        <div className="flex gap-4">
          {showBack && onBack && (
            <button
              onClick={onBack}
              className="flex-1 border-2 border-muted px-6 py-4 font-bold uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:border-secondary hover:text-secondary"
            >
              Voltar
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              disabled={!isValid}
              className={`btn-neon flex-1 ${
                !isValid ? "cursor-not-allowed opacity-50" : "animate-pulse-glow"
              }`}
            >
              {nextLabel}
            </button>
          )}
        </div>
      </div>
    </FullscreenImage>
  );
};

export default FormStep;
