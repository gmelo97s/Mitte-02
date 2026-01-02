import { useState } from "react";
import FullscreenImage from "@/components/FullscreenImage";
import FormStep from "@/components/FormStep";
import SummaryScreen from "@/components/SummaryScreen";
import heroMitte from "@/assets/hero_mitte.jpg";
import balcaoFrente from "@/assets/balcao_frente.jpg";
import balcaoSofa from "@/assets/balcao_sofa.jpg";
import mictoriosRosa from "@/assets/mictorios_rosa.jpg";
import palco from "@/assets/palco.jpg";
import pistaBalcao from "@/assets/pista_balcao.jpg";
import sofasVista from "@/assets/sofas_vista.jpg";
interface FormData {
  nome: string;
  pessoas: string;
  data: string;
  horario: string;
  observacoes: string;
  telefone: string;
}
const stepBackgrounds = [balcaoFrente, balcaoSofa, mictoriosRosa, palco, pistaBalcao, sofasVista];
const Index = () => {
  const [currentStep, setCurrentStep] = useState(-1); // -1 = hero, 0-5 = form steps, 6 = summary
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    pessoas: "",
    data: "",
    horario: "",
    observacoes: "",
    telefone: ""
  });
  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const goNext = () => setCurrentStep(prev => prev + 1);
  const goBack = () => setCurrentStep(prev => prev - 1);
  const generateWhatsAppMessage = () => {
    const message = `Olá, gostaria de comemorar meu aniversário no Mitte!

Qual o seu nome?
R: ${formData.nome}

Quantas pessoas pretende convidar?
R: ${formData.pessoas}

Qual a data do seu aniversário?
R: ${formData.data}

Em qual horário gostaria de começar a sua festa?
R: ${formData.horario}

Gostaria de fazer alguma observação?
R: ${formData.observacoes || "Sem observações"}

Qual o seu contato de WhatsApp/Telefone?
R: ${formData.telefone}

Em breve nossa equipe irá confirmar por aqui o seu agendamento.`;
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "5511985767874";
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };
  const handleConfirm = () => {
    const whatsappUrl = generateWhatsAppMessage();
    window.open(whatsappUrl, "_blank");
  };

  // Hero Screen
  if (currentStep === -1) {
    return <FullscreenImage src={heroMitte} alt="Mitte Birthday" overlay={false}>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        <div className="relative z-10 flex flex-col items-center justify-end pb-20 min-h-screen">
          <div className="animate-slide-up text-center">
            
            
            <button onClick={() => setCurrentStep(0)} className="btn-neon animate-pulse-glow text-lg">
              Agendar meu aniversário
            </button>
          </div>
        </div>
      </FullscreenImage>;
  }

  // Summary Screen
  if (currentStep === 6) {
    return <SummaryScreen formData={formData} backgroundImage={stepBackgrounds[0]} onBack={goBack} onConfirm={handleConfirm} onEdit={updateFormData} />;
  }

  // Form Steps
  const formSteps = [{
    question: "Qual o seu nome?",
    field: "nome" as keyof FormData,
    type: "text",
    placeholder: "Digite seu nome completo"
  }, {
    question: "Quantas pessoas pretende convidar?",
    field: "pessoas" as keyof FormData,
    type: "number",
    placeholder: "Ex: 30"
  }, {
    question: "Qual a data do seu aniversário?",
    field: "data" as keyof FormData,
    type: "date",
    placeholder: ""
  }, {
    question: "Em qual horário gostaria de começar?",
    field: "horario" as keyof FormData,
    type: "time",
    placeholder: ""
  }, {
    question: "Gostaria de fazer alguma observação?",
    field: "observacoes" as keyof FormData,
    type: "textarea",
    placeholder: "Decore específica, música especial, etc...",
    optional: true
  }, {
    question: "Qual o seu WhatsApp/Telefone?",
    field: "telefone" as keyof FormData,
    type: "tel",
    placeholder: "(11) 99999-9999"
  }];
  const currentFormStep = formSteps[currentStep];
  const isOptional = currentFormStep?.optional;
  const currentValue = formData[currentFormStep?.field];
  const isValid = isOptional || currentValue && currentValue.trim() !== "";
  return <FormStep backgroundImage={stepBackgrounds[currentStep]} stepNumber={currentStep} totalSteps={formSteps.length} question={currentFormStep.question} onNext={goNext} onBack={currentStep > 0 ? goBack : undefined} showBack={currentStep > 0} nextLabel={currentStep === formSteps.length - 1 ? "Ver Resumo" : "Próximo"} isValid={isValid}>
      {currentFormStep.type === "textarea" ? <textarea value={formData[currentFormStep.field]} onChange={e => updateFormData(currentFormStep.field, e.target.value)} placeholder={currentFormStep.placeholder} className="input-neon min-h-[120px] resize-none" rows={4} /> : <input type={currentFormStep.type} value={formData[currentFormStep.field]} onChange={e => updateFormData(currentFormStep.field, e.target.value)} placeholder={currentFormStep.placeholder} className="input-neon" />}
    </FormStep>;
};
export default Index;