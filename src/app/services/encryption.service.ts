import { Injectable } from '@angular/core';
import { globalProperties } from '../shared/globalProperties';
import * as CryptoJS from 'crypto-js'
@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey = globalProperties.secret_key;
  constructor() { }
  encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
