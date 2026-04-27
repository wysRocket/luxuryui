import { httpsCallable } from 'firebase/functions';
import { getFirebaseFunctionsClient } from './firebaseClient';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContactForm(data: ContactFormData): Promise<void> {
  const fns = getFirebaseFunctionsClient();
  const fn = httpsCallable(fns, 'submitContactForm');
  await fn(data);
}
