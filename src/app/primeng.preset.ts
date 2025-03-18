import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const PrimengPreset = definePreset(Aura, {
  primitive: {
    blue: {
      '50': '#e7f0ff',
      '100': '#c3dbf5',
      '200': '#9fc5eb',
      '300': '#7aafe0',
      '400': '#5699d6',
      '500': '#3383cc',
      '600': '#1f6ab2',
      '700': '#15518e',
      '800': '#0b396a',
      '900': '#021146',
    },
  },
  semantic: {
    primary: {
      '50': '{blue.50}',
      '100': '{blue.100}',
      '200': '{blue.200}',
      '300': '{blue.300}',
      '400': '{blue.400}',
      '500': '{blue.500}',
      '600': '{blue.600}',
      '700': '{blue.700}',
      '800': '{blue.800}',
      '900': '{blue.900}',
    },
    // colorScheme: {
    //   dark: {
    //     surface: {
    //       0: '#ffffff',
    //       50: '{#f5f5f5}',
    //       100: '{#ebebeb}',
    //       200: '{#d6d6d6',
    //       300: '{#c2c2c2',
    //       400: '{#999999',
    //       500: '{#707070',
    //       600: '{#5c5c5c',
    //       700: '#474747',
    //       800: '#333333',
    //       900: '#1a1a1a',
    //       950: '#0d0d0d',
    //     },
    //   },
    // },
  },
});
