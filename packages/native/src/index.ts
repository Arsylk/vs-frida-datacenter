import { attachRegisterNatives } from './registerNatives.js';
import { attachSystemPropertyGet } from './systemPropertyGet.js';
import { JNIHook } from './inject.js';
import { dumpFile } from './utils.js';

export { attachRegisterNatives, attachSystemPropertyGet, JNIHook, dumpFile };
