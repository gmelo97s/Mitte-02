import { useState, useEffect, useRef, TouchEvent } from "react";
import FormStep from "@/components/FormStep";
import SummaryScreen from "@/components/SummaryScreen";
import heroMitte from "@/assets/hero_mitte.png";
import balcaoFrente from "@/assets/balcao_frente.jpg";
import balcaoSofa from "@/assets/balcao_sofa.jpg";
import mictoriosRosa from "@/assets/mictorios_rosa.jpg";
import palco from "@/assets/palco.jpg";
import pistaBalcao from "@/assets/pista_balcao.jpg";
import sofasVista from "@/assets/sofas_vista.jpg";
import pistaFreezers from "@/assets/pista_freezers.jpg";
import { MapPin, Clock, X, ChevronLeft, ChevronRight } from "lucide-react";

interface FormData {
  nome: string;
  pessoas: string;
  data: string;
  horario: string;
  observacoes: string;
  telefone: string;
}

const stepBackgrounds = [balcaoFrente, balcaoSofa, mictoriosRosa, palco, pistaBalcao, sofasVista];

// Todas as imagens para o carrossel do hero
const heroCarouselImages = [
  heroMitte,
  balcaoFrente,
  balcaoSofa,
  mictoriosRosa,
  palco,
  pistaBalcao,
  sofasVista,
  pistaFreezers,
];

const Index = () => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    pessoas: "",
    data: "",
    horario: "",
    observacoes: "",
    telefone: ""
  });
  
  // Estado para o carrossel do hero
  const [heroIndex, setHeroIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(true);

  // Estado para a galeria modal
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const galleryImages = [
    { src: balcaoFrente, alt: "Balcão de frente" },
    { src: balcaoSofa, alt: "Balcão com sofá" },
    { src: mictoriosRosa, alt: "Ambiente rosa" },
    { src: palco, alt: "Palco" },
    { src: pistaBalcao, alt: "Pista e balcão" },
    { src: sofasVista, alt: "Vista dos sofás" },
  ];

  // Carrossel automático do hero
  useEffect(() => {
    const interval = setInterval(() => {
      setIsZooming(false);
      setTimeout(() => {
        setHeroIndex((prev) => (prev + 1) % heroCarouselImages.length);
        setIsZooming(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Funções de navegação da galeria
  const goToPrevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? galleryImages.length - 1 : (prev as number) - 1
      );
    }
  };

  const goToNextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => 
        prev === galleryImages.length - 1 ? 0 : (prev as number) + 1
      );
    }
  };

  // Touch handlers para swipe
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        goToNextImage();
      } else {
        goToPrevImage();
      }
    }
  };

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

  // Hero Screen com Carrossel
  if (currentStep === -1) {
    return (
      <div className="bg-background">
        {/* Hero Section com Carrossel */}
        <div className="relative min-h-screen w-full overflow-hidden">
          {/* Carrossel de imagens */}
          {heroCarouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === heroIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image}
                alt={`Mitte ${index + 1}`}
                className={`h-full w-full object-cover transition-transform duration-[5000ms] ease-out ${
                  index === heroIndex && isZooming ? "scale-110" : "scale-100"
                }`}
              />
            </div>
          ))}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
          
          {/* Conteúdo do Hero */}
          <div className="relative z-10 flex flex-col items-center justify-end pb-20 min-h-screen">
            <div className="animate-slide-up text-center mb-32">
              <button 
                onClick={() => setCurrentStep(0)} 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-primary/50 text-xs"
              >
                Agendar meu aniversário
              </button>
            </div>
          </div>
        </div>

        {/* Segunda Dobra - Conheça Nosso Ambiente */}
        <section className="py-12 px-4 md:py-20 md:px-8">
          {/* Título */}
          <div className="text-center mb-8">
            <h2 
              className="text-2xl md:text-4xl font-black uppercase tracking-wider text-foreground mb-2"
              style={{ 
                textShadow: '2px 2px 0px hsl(var(--primary)), -1px -1px 0px hsl(var(--primary))',
                letterSpacing: '0.15em'
              }}
            >
              Conheça nosso ambiente
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Toque nas fotos para ampliar
            </p>
          </div>

          {/* Galeria de Fotos */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 max-w-4xl mx-auto mb-8">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className="relative aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
              </button>
            ))}
          </div>

          {/* Botão Agendar - mesmo estilo do hero */}
          <div className="max-w-4xl mx-auto mb-12 flex justify-center">
            <button 
              onClick={() => setCurrentStep(0)} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-primary/50 text-xs"
            >
              Agendar meu aniversário
            </button>
          </div>

          {/* Info Cards - Endereço e Horário */}
          <div className="max-w-sm mx-auto space-y-3">
            {/* Endereço - Link para Google Maps */}
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Rua+Rego+Freitas+566+República+São+Paulo"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground rounded-lg p-3 flex items-center gap-3 shadow-md shadow-primary/30 hover:bg-primary/90 transition-colors"
            >
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <div>
                <span className="font-semibold text-xs uppercase tracking-wide block">Localização</span>
                <span className="text-xs opacity-90">Rua Rego Freitas 566, República, São Paulo</span>
              </div>
            </a>
            
            {/* Horário */}
            <div className="bg-primary text-primary-foreground rounded-lg p-3 flex items-center gap-3 shadow-md shadow-primary/30">
              <Clock className="w-5 h-5 flex-shrink-0" />
              <div>
                <span className="font-semibold text-xs uppercase tracking-wide block">Horário</span>
                <span className="text-xs opacity-90">Quinta 18h-00h | Sexta e Sáb. 18h-02h</span>
              </div>
            </div>
          </div>
        </section>

        {/* Modal de Imagem Ampliada com Swipe */}
        {selectedImageIndex !== null && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Botão fechar */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 right-4 text-white/80 hover:text-white p-2 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>
            
            {/* Botão anterior */}
            <button
              onClick={goToPrevImage}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 transition-colors z-10"
            >
              <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
            </button>
            
            {/* Imagem */}
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={galleryImages[selectedImageIndex].src}
                alt={galleryImages[selectedImageIndex].alt}
                className="max-w-full max-h-[85vh] object-contain rounded-lg animate-fade-in"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            {/* Botão próximo */}
            <button
              onClick={goToNextImage}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 transition-colors z-10"
            >
              <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
            </button>
            
            {/* Indicadores */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === selectedImageIndex 
                      ? "bg-primary w-6" 
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
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
    placeholder: "Decoração específica, música especial, etc...",
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

  return (
    <FormStep 
      backgroundImage={stepBackgrounds[currentStep]} 
      stepNumber={currentStep} 
      totalSteps={formSteps.length} 
      question={currentFormStep.question} 
      onNext={goNext} 
      onBack={currentStep > 0 ? goBack : undefined} 
      showBack={currentStep > 0} 
      nextLabel={currentStep === formSteps.length - 1 ? "Ver Resumo" : "Próximo"} 
      isValid={isValid}
    >
      {currentFormStep.type === "textarea" ? (
        <textarea 
          value={formData[currentFormStep.field]} 
          onChange={e => updateFormData(currentFormStep.field, e.target.value)} 
          placeholder={currentFormStep.placeholder} 
          className="input-neon min-h-[120px] resize-none" 
          rows={4} 
        />
      ) : (
        <input 
          type={currentFormStep.type} 
          value={formData[currentFormStep.field]} 
          onChange={e => updateFormData(currentFormStep.field, e.target.value)} 
          placeholder={currentFormStep.placeholder} 
          className="input-neon" 
        />
      )}
    </FormStep>
  );
};

export default Index;
