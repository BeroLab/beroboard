"use client"

import { Input, parseColor, type Color } from "react-aria-components"

import {
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  ColorThumb,
  SliderTrack,
} from "~/components/ui/color"
import { Button } from "~/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Label } from "~/components/ui/label"
import { PaletteIcon } from "@phosphor-icons/react"

interface HexPickerProps {
  color: Color;
  setColor: (color: Color) => void;
}

export function HexPicker({ color, setColor }: HexPickerProps) {
  
    const handleColorChange = (newColor: Color) => {
      const hexString = newColor.toFormat('rgb').toString('hex');
      setColor(parseColor(hexString));
    };
  
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" size="lg" className="rounded-sm">
            <PaletteIcon size={32} />
          </Button>
        }
      />
        
      <PopoverContent className="w-auto p-3" align="start">
        <ColorPicker value={color} onChange={handleColorChange}>
          
          <div className="flex flex-col gap-2">
            <ColorArea
              colorSpace="hsb"
              xChannel="saturation"
              yChannel="brightness"
              aria-label="Saturation and brightness selector"
              className="h-41 w-48 rounded-md border shadow-sm"
            >
              <ColorThumb className="z-50" />
            </ColorArea>
            
            <ColorSlider 
              colorSpace="hsb" 
              channel="hue" 
              aria-label="Hue selector"
            >
              <SliderTrack className="h-5 w-48 rounded-full">
                <ColorThumb className="top-1/2 size-4" />
              </SliderTrack>
            </ColorSlider>
          </div>

          <ColorField 
            className="flex w-48 flex-col gap-1"
            aria-label="Hexadecimal color field"
          >
            <Label className="text-xs font-medium text-muted-foreground">Hex</Label>
            <Input 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="#000000"
            />
          </ColorField>

          <ColorSwatchPicker 
            className="flex w-48 flex-wrap gap-2"
            aria-label="Predefined Colors"
            onChange={handleColorChange}
          >
            <ColorSwatchPickerItem color="#F00">
              <ColorSwatch className="size-8 rounded-md cursor-pointer" />
            </ColorSwatchPickerItem>
            <ColorSwatchPickerItem color="#f90">
              <ColorSwatch className="size-8 rounded-md cursor-pointer" />
            </ColorSwatchPickerItem>
            <ColorSwatchPickerItem color="#0F0">
              <ColorSwatch className="size-8 rounded-md cursor-pointer" />
            </ColorSwatchPickerItem>
            <ColorSwatchPickerItem color="#08f">
              <ColorSwatch className="size-8 rounded-md cursor-pointer" />
            </ColorSwatchPickerItem>
            <ColorSwatchPickerItem color="#00f">
              <ColorSwatch className="size-8 rounded-md cursor-pointer" />
            </ColorSwatchPickerItem>
          </ColorSwatchPicker>

        </ColorPicker>
      </PopoverContent>
    </Popover>
  )
}