// jest.setup.js
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;


// Set up Jest global
import { jest } from '@jest/globals';
global.jest = jest;