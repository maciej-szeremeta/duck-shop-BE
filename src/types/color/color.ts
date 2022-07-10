import { ColorEntity, } from './color.entity';

export type CreateColorReq = Omit<ColorEntity, 'id' | 'createdAt' | 'updatedAt'>;

export interface CreateColorRes { newColor: ColorEntity }

export interface UpdateColorRes { color: ColorEntity}

export interface ColorRes { color: ColorEntity };

export interface ColorsListRes { colorsList: ColorEntity[] };