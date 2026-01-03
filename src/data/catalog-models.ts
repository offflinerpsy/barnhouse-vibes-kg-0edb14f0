/**
 * =============================================================================
 * CATALOG MODELS — Единый источник данных для каталога ERA
 * =============================================================================
 * 
 * Система именования: Model + количество модулей (1 модуль ≈ 18м²)
 * - Одноэтажные: Model 1, 2, 3, 4, 6, 8
 * - Двухэтажные (Duplex): Model 2X, 4X, 7X, 12X
 * - Коммерческие: Model Resto
 * 
 * Model 5 и Model 7 НЕ СУЩЕСТВУЮТ — это задокументировано
 * 
 * =============================================================================
 */

export type FilterType = "all" | "1-floor" | "2-floor" | "business";

export interface FloorPlanFile {
  name: string;
  ext: "webp" | "pdf";
}

export interface CatalogModel {
  id: string;
  name: string;
  area: number;
  heatedArea: number;
  floors: number;
  rooms: number;
  bedrooms: string;
  bathrooms: number;
  hasVeranda: boolean;
  verandaArea?: number;
  catalogPath: string;
  coverImage: string;
  galleryCount: number;
  galleryExtraCount: number;
  floorPlanFiles: FloorPlanFile[];
  projectType: "single-floor" | "duplex" | "commercial";
  projectLabel: string;
}

// Единый массив моделей для всего приложения
export const CATALOG_MODELS: CatalogModel[] = [
  // ============================================
  // ОДНОЭТАЖНЫЕ МОДЕЛИ (Single Floor)
  // ============================================
  {
    id: "model-1",
    name: "Model 1",
    projectType: "single-floor",
    projectLabel: "Одноэтажный",
    area: 18,
    heatedArea: 18,
    floors: 1,
    rooms: 1,
    bedrooms: "студия",
    bathrooms: 1,
    hasVeranda: false,
    catalogPath: "model-1-18",
    coverImage: "/catalog/covers/model-1.webp",
    galleryCount: 4,
    galleryExtraCount: 25,
    floorPlanFiles: [
      { name: "plan-1", ext: "webp" },
      { name: "plan-2", ext: "webp" },
      { name: "plan-3", ext: "webp" },
    ],
  },
  {
    id: "model-2",
    name: "Model 2",
    projectType: "single-floor",
    projectLabel: "Одноэтажный",
    area: 36,
    heatedArea: 36,
    floors: 1,
    rooms: 2,
    bedrooms: "1",
    bathrooms: 1,
    hasVeranda: true,
    verandaArea: 12,
    catalogPath: "model-1-36",
    coverImage: "/catalog/covers/model-2.webp",
    galleryCount: 4,
    galleryExtraCount: 24,
    floorPlanFiles: [
      { name: "plan-1", ext: "webp" },
    ],
  },
  {
    id: "model-3",
    name: "Model 3",
    projectType: "single-floor",
    projectLabel: "Одноэтажный",
    area: 54,
    heatedArea: 54,
    floors: 1,
    rooms: 3,
    bedrooms: "1-2",
    bathrooms: 1,
    hasVeranda: true,
    verandaArea: 15,
    catalogPath: "model-1-54",
    coverImage: "/catalog/covers/model-3.webp",
    galleryCount: 8,
    galleryExtraCount: 33,
    floorPlanFiles: [
      { name: "plan-2", ext: "webp" },
      { name: "plan-3", ext: "webp" },
      { name: "plan-4", ext: "webp" },
    ],
  },
  {
    id: "model-4",
    name: "Model 4",
    projectType: "single-floor",
    projectLabel: "Одноэтажный",
    area: 81,
    heatedArea: 81,
    floors: 1,
    rooms: 4,
    bedrooms: "2-3",
    bathrooms: 2,
    hasVeranda: true,
    verandaArea: 20,
    catalogPath: "model-1-81",
    coverImage: "/catalog/covers/model-4.webp",
    galleryCount: 4,
    galleryExtraCount: 34,
    floorPlanFiles: [],
  },
  {
    id: "model-6",
    name: "Model 6",
    projectType: "single-floor",
    projectLabel: "Одноэтажный",
    area: 108,
    heatedArea: 108,
    floors: 1,
    rooms: 5,
    bedrooms: "3-4",
    bathrooms: 2,
    hasVeranda: true,
    verandaArea: 25,
    catalogPath: "model-1-108",
    coverImage: "/catalog/covers/model-6.webp",
    galleryCount: 4,
    galleryExtraCount: 54,
    floorPlanFiles: [
      { name: "plan-1", ext: "webp" },
      { name: "plan-2", ext: "webp" },
      { name: "plan-3", ext: "webp" },
    ],
  },
  {
    id: "model-8",
    name: "Model 8",
    projectType: "single-floor",
    projectLabel: "Одноэтажный",
    area: 135,
    heatedArea: 135,
    floors: 1,
    rooms: 6,
    bedrooms: "4-5",
    bathrooms: 2,
    hasVeranda: true,
    verandaArea: 30,
    catalogPath: "model-1-135",
    coverImage: "/catalog/covers/model-8.webp",
    galleryCount: 5,
    galleryExtraCount: 38,
    floorPlanFiles: [
      { name: "plan-1", ext: "webp" },
      { name: "plan-2", ext: "webp" },
      { name: "plan-3", ext: "webp" },
    ],
  },

  // ============================================
  // ДВУХЭТАЖНЫЕ МОДЕЛИ (Duplex)
  // ============================================
  {
    id: "model-2x",
    name: "Model 2X",
    projectType: "duplex",
    projectLabel: "Двухэтажный",
    area: 36,
    heatedArea: 36,
    floors: 2,
    rooms: 2,
    bedrooms: "1",
    bathrooms: 1,
    hasVeranda: false,
    catalogPath: "model-2-36",
    coverImage: "/catalog/covers/model-2x.webp",
    galleryCount: 4,
    galleryExtraCount: 0,
    floorPlanFiles: [],
  },
  {
    id: "model-4x",
    name: "Model 4X",
    projectType: "duplex",
    projectLabel: "Двухэтажный",
    area: 72,
    heatedArea: 72,
    floors: 2,
    rooms: 4,
    bedrooms: "2-3",
    bathrooms: 2,
    hasVeranda: true,
    verandaArea: 18,
    catalogPath: "model-2-72",
    coverImage: "/catalog/covers/model-4x.webp",
    galleryCount: 4,
    galleryExtraCount: 6,
    floorPlanFiles: [],
  },
  {
    id: "model-7x",
    name: "Model 7X",
    projectType: "duplex",
    projectLabel: "Двухэтажный",
    area: 120,
    heatedArea: 120,
    floors: 2,
    rooms: 5,
    bedrooms: "3-4",
    bathrooms: 2,
    hasVeranda: true,
    verandaArea: 25,
    catalogPath: "model-2-120",
    coverImage: "/catalog/covers/model-7x.webp",
    galleryCount: 4,
    galleryExtraCount: 0,
    floorPlanFiles: [
      { name: "plan-1", ext: "webp" },
      { name: "plan-2", ext: "webp" },
      { name: "plan-3", ext: "webp" },
    ],
  },
  {
    id: "model-12x",
    name: "Model 12X",
    projectType: "duplex",
    projectLabel: "Двухэтажный",
    area: 204,
    heatedArea: 204,
    floors: 2,
    rooms: 8,
    bedrooms: "5-6",
    bathrooms: 3,
    hasVeranda: true,
    verandaArea: 40,
    catalogPath: "model-2-204",
    coverImage: "/catalog/covers/model-12x.webp",
    galleryCount: 6,
    galleryExtraCount: 0,
    floorPlanFiles: [],
  },

  // ============================================
  // КОММЕРЧЕСКИЕ МОДЕЛИ (Commercial/HoReCa)
  // ============================================
  {
    id: "model-resto",
    name: "Model Resto",
    projectType: "commercial",
    projectLabel: "HoReCa",
    area: 72,
    heatedArea: 72,
    floors: 1,
    rooms: 0,
    bedrooms: "—",
    bathrooms: 2,
    hasVeranda: true,
    verandaArea: 30,
    catalogPath: "model-resto",
    coverImage: "/catalog/covers/model-resto.webp",
    galleryCount: 0,
    galleryExtraCount: 0,
    floorPlanFiles: [],
  },
];

// Хелпер для фильтрации
export function applyCatalogFilter(models: CatalogModel[], filter: FilterType): CatalogModel[] {
  if (filter === "all") return models.filter((m) => m.projectType !== "commercial");
  if (filter === "1-floor") return models.filter((m) => m.floors === 1 && m.projectType !== "commercial");
  if (filter === "2-floor") return models.filter((m) => m.floors === 2);
  if (filter === "business") return models.filter((m) => m.projectType === "commercial");
  return models;
}

// Хелпер для генерации путей к изображениям галереи
export function getGalleryImages(model: CatalogModel): string[] {
  const images: string[] = [model.coverImage];
  for (let i = 1; i <= model.galleryExtraCount; i++) {
    images.push(`/catalog/${model.catalogPath}/gallery-extra/extra-${i}.webp`);
  }
  for (let i = 1; i <= model.galleryCount; i++) {
    images.push(`/catalog/${model.catalogPath}/gallery/${i}.webp`);
  }
  return images;
}

// Хелпер для путей к планировкам
export function getFloorPlanPaths(model: CatalogModel): { path: string; isPdf: boolean }[] {
  return model.floorPlanFiles.map((file) => ({
    path: `/catalog/${model.catalogPath}/floor-plan/${file.name}.${file.ext}`,
    isPdf: file.ext === "pdf",
  }));
}

// Типы фильтров для UI
export const PROJECT_FILTERS = [
  { value: "all" as FilterType, label: "Все модели" },
  { value: "1-floor" as FilterType, label: "Одноэтажные" },
  { value: "2-floor" as FilterType, label: "Двухэтажные" },
  { value: "business" as FilterType, label: "HoReCa" },
];

export const AREA_RANGES = [
  { value: "all", label: "Все метражи", min: 0, max: Infinity },
  { value: "compact", label: "до 40м²", min: 0, max: 40 },
  { value: "small", label: "40-80м²", min: 40, max: 80 },
  { value: "medium", label: "80-130м²", min: 80, max: 130 },
  { value: "large", label: "130м²+", min: 130, max: Infinity },
];
