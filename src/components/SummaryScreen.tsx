import { useState } from "react";
import FullscreenImage from "./FullscreenImage";

interface FormData {
  nome: string;
  pessoas: string;
  data: string;
  horario: string;
  observacoes: string;
  telefone: string;
}

interface SummaryScreenProps {
  formData: FormData;
  backgroundImage: string;
  onBack: () => void;
  onConfirm: () => void;
  onEdit: (field: keyof FormData, value: string) => void;
}

const SummaryScreen = ({
  formData,
  backgroundImage,
  onBack,
  onConfirm,
  onEdit,
}: SummaryScreenProps) => {
  const [editingField, setEditingField] = useState<keyof FormData | null>(null);
  const [editValue, setEditValue] = useState("");

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const fields: { key: keyof FormData; label: string }[] = [
    { key: "nome", label: "Qual o seu nome?" },
    { key: "pessoas", label: "Quantas pessoas pretende convidar?" },
    { key: "data", label: "Qual a data do seu aniversário?" },
    { key: "horario", label: "Em qual horário gostaria de começar?" },
    { key: "observacoes", label: "Alguma observação?" },
    { key: "telefone", label: "Seu WhatsApp/Telefone" },
  ];

  const handleStartEdit = (field: keyof FormData) => {
    setEditingField(field);
    setEditValue(formData[field]);
  };

  const handleSaveEdit = () => {
    if (editingField) {
      onEdit(editingField, editValue);
      setEditingField(null);
      setEditValue("");
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  return (
    <FullscreenImage src={backgroundImage} alt="Summary">
      <div className="w-full max-w-lg animate-slide-up">
        {/* Header */}
        <div className="mb-6 text-center">
          <span className="text-sm uppercase tracking-widest text-secondary text-glow-cyan">
            Confirmação
          </span>
        </div>

        <h2 className="mb-6 text-center text-2xl font-bold uppercase tracking-wide text-foreground md:text-3xl">
          Resumo do Agendamento
        </h2>

        {/* Summary list */}
        <div className="mb-8 space-y-3 rounded-lg border-2 border-muted bg-background/80 p-4 backdrop-blur-sm">
          {fields.map(({ key, label }) => (
            <div
              key={key}
              className="group flex items-start justify-between gap-2 border-b border-muted/50 pb-3 last:border-0 last:pb-0"
            >
              {editingField === key ? (
                <div className="flex-1">
                  <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                    {label}
                  </p>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="input-neon mb-2 py-2 text-sm"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1 text-xs font-bold uppercase text-accent"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 text-xs font-bold uppercase text-muted-foreground"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                      {label}
                    </p>
                    <p className="text-sm text-foreground">
                      {key === "data" ? formatDate(formData[key]) : (formData[key] || "-")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleStartEdit(key)}
                    className="px-2 py-1 text-xs font-bold uppercase text-primary"
                  >
                    Editar
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 border-2 border-muted px-6 py-4 font-bold uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:border-secondary hover:text-secondary"
          >
            Voltar
          </button>
          <button
            onClick={onConfirm}
            className="btn-neon flex-1 animate-pulse-glow"
          >
            Confirmar
          </button>
        </div>
      </div>
    </FullscreenImage>
  );
};

export default SummaryScreen;
