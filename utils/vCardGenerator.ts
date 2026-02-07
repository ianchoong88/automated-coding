
import { ContactInfo } from "../types";

export const generateVCard = (contact: ContactInfo): string => {
  const vCardLines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${contact.fullName || `${contact.firstName || ''} ${contact.lastName || ''}`.trim()}`,
    `N:${contact.lastName || ''};${contact.firstName || ''};;;`,
    contact.organization ? `ORG:${contact.organization}` : '',
    contact.jobTitle ? `TITLE:${contact.jobTitle}` : '',
    contact.email ? `EMAIL;TYPE=INTERNET,PREF:${contact.email}` : '',
    contact.phone ? `TEL;TYPE=WORK,VOICE:${contact.phone}` : '',
    contact.mobile ? `TEL;TYPE=CELL,VOICE:${contact.mobile}` : '',
    contact.website ? `URL:${contact.website}` : '',
    contact.address || contact.city ? `ADR;TYPE=WORK:;;${contact.address || ''};${contact.city || ''};${contact.state || ''};${contact.zipCode || ''};${contact.country || ''}` : '',
    contact.notes ? `NOTE:${contact.notes}` : '',
    'END:VCARD'
  ];

  return vCardLines.filter(line => line.trim() !== '').join('\n');
};

export const downloadVCard = (contact: ContactInfo) => {
  const content = generateVCard(contact);
  const blob = new Blob([content], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = contact.fullName ? contact.fullName.replace(/\s+/g, '_') : 'contact';
  link.href = url;
  link.download = `${filename}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
