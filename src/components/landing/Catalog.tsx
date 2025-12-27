/**
 * =============================================================================
 * CATALOG SECTION - Каталог домов
 * =============================================================================
 * 
 * ID: #catalog
 * 
 * Содержит:
 * - Фильтр по категориям (Мини, Стандарт, Большие, Премиум)
 * - Сетка карточек домов (8 моделей)
 * - Модальное окно с деталями дома
 * - Карусель изображений в модалке
 * 
 * Категории:
 * - mini: до 35м²
 * - standard: 35-60м²
 * - large: 60-100м²
 * - premium: 100м²+
 * 
 * =============================================================================
 */

import { useState } from "react";
import { ArrowRight, BedDouble, Maximize, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Типы категорий домов
type Category = "all" | "mini" | "standard" | "large" | "premium";

// Интерфейс модели дома
interface HouseModel {
  id: string;
  name: string;
  category: Exclude<Category, "all">;
  area: number;
  rooms: number;
  price: string;
  images: string[];
  description: string;
  features: string[];
}

// Список категорий для фильтра

const categories: { value: Category; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "mini", label: "Мини (до 35м²)" },
  { value: "standard", label: "Стандарт (35-60м²)" },
  { value: "large", label: "Большие (60-100м²)" },
  { value: "premium", label: "Премиум (100м²+)" },
];

const houses: HouseModel[] = [
  {
    id: "1",
    name: "ERA Mini Studio",
    category: "mini",
    area: 25,
    rooms: 1,
    price: "от $12 000",
    images: [
      "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
    ],
    description: "Компактный модульный дом для дачи или гостевого домика",
    features: ["Спальня-гостиная", "Мини-кухня", "Санузел", "Терраса 8м²"],
  },
  {
    id: "2",
    name: "ERA Compact",
    category: "mini",
    area: 32,
    rooms: 1,
    price: "от $15 000",
    images: [
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop",
    ],
    description: "Уютный дом для постоянного проживания одного-двух человек",
    features: ["Спальня", "Гостиная-кухня", "Санузел", "Терраса 10м²"],
  },
  {
    id: "3",
    name: "ERA Standard 45",
    category: "standard",
    area: 45,
    rooms: 2,
    price: "от $22 000",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
    ],
    description: "Оптимальный выбор для небольшой семьи или пары",
    features: ["2 спальни", "Гостиная", "Кухня", "Санузел", "Терраса"],
  },
  {
    id: "4",
    name: "ERA Standard 55",
    category: "standard",
    area: 55,
    rooms: 2,
    price: "от $28 000",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=2074&auto=format&fit=crop",
    ],
    description: "Просторный дом с продуманной планировкой",
    features: ["2 спальни", "Гостиная", "Кухня-столовая", "Санузел", "Терраса 15м²"],
  },
  {
    id: "5",
    name: "ERA Family 75",
    category: "large",
    area: 75,
    rooms: 3,
    price: "от $38 000",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2084&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070&auto=format&fit=crop",
    ],
    description: "Комфортный семейный дом с тремя спальнями",
    features: ["3 спальни", "Гостиная", "Кухня-столовая", "2 санузла", "Терраса"],
  },
  {
    id: "6",
    name: "ERA Family 90",
    category: "large",
    area: 90,
    rooms: 4,
    price: "от $45 000",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2187&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600573472556-e636c2acda88?q=80&w=2070&auto=format&fit=crop",
    ],
    description: "Большой дом для семьи с детьми",
    features: ["4 спальни", "Гостиная", "Кухня-столовая", "2 санузла", "Терраса 20м²"],
  },
  {
    id: "7",
    name: "ERA Premium 120",
    category: "premium",
    area: 120,
    rooms: 4,
    price: "от $65 000",
    images: [
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
    ],
    description: "Премиальный дом с панорамными окнами и высокими потолками",
    features: ["4 спальни", "Гостиная 35м²", "Кухня-столовая", "2 санузла", "Терраса 25м²", "Гараж"],
  },
  {
    id: "8",
    name: "ERA Premium 150",
    category: "premium",
    area: 150,
    rooms: 5,
    price: "от $85 000",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=2074&auto=format&fit=crop",
    ],
    description: "Эксклюзивный дом премиум-класса для требовательных клиентов",
    features: ["5 спален", "Гостиная 45м²", "Кухня-столовая", "3 санузла", "Терраса 30м²", "Гараж на 2 авто"],
  },
];

export function Catalog() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selectedHouse, setSelectedHouse] = useState<HouseModel | null>(null);

  const filteredHouses =
    activeCategory === "all"
      ? houses
      : houses.filter((house) => house.category === activeCategory);

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setSelectedHouse(null);
  };

  return (
    <section id="catalog" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Наши проекты
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            Каталог домов
          </h2>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={activeCategory === cat.value ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat.value)}
              className={`rounded-full transition-all ${
                activeCategory === cat.value
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-primary/10"
              }`}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Houses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredHouses.map((house) => (
            <div
              key={house.id}
              className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={house.images[0]}
                  alt={house.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                  {house.category === "mini" && "Мини"}
                  {house.category === "standard" && "Стандарт"}
                  {house.category === "large" && "Большой"}
                  {house.category === "premium" && "Премиум"}
                </Badge>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {house.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Maximize className="h-4 w-4" />
                    {house.area}м²
                  </span>
                  <span className="flex items-center gap-1">
                    <BedDouble className="h-4 w-4" />
                    {house.rooms} {house.rooms === 1 ? "комн." : "комн."}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {house.price}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedHouse(house)}
                    className="text-primary hover:text-primary hover:bg-primary/10"
                  >
                    Подробнее
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* House Detail Modal */}
      <Dialog open={!!selectedHouse} onOpenChange={() => setSelectedHouse(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedHouse && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">
                  {selectedHouse.name}
                </DialogTitle>
              </DialogHeader>

              {/* Image Carousel */}
              <Carousel className="w-full">
                <CarouselContent>
                  {selectedHouse.images.map((img, idx) => (
                    <CarouselItem key={idx}>
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={img}
                          alt={`${selectedHouse.name} - ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>

              {/* Details */}
              <div className="space-y-6 mt-4">
                <p className="text-muted-foreground">{selectedHouse.description}</p>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Maximize className="h-5 w-5 text-primary" />
                    <span className="font-medium">{selectedHouse.area}м²</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BedDouble className="h-5 w-5 text-primary" />
                    <span className="font-medium">{selectedHouse.rooms} комнат</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Grid className="h-5 w-5 text-primary" />
                    <span className="font-medium capitalize">
                      {selectedHouse.category === "mini" && "Мини"}
                      {selectedHouse.category === "standard" && "Стандарт"}
                      {selectedHouse.category === "large" && "Большой"}
                      {selectedHouse.category === "premium" && "Премиум"}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-display font-semibold mb-3">В комплектацию входит:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHouse.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-2xl font-bold text-primary">
                    {selectedHouse.price}
                  </span>
                  <Button
                    size="lg"
                    onClick={scrollToContact}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Узнать цену
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
