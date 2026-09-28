import { Certification, CertLevel } from '../types';

export interface ParsedCertDate {
  year: number;
  month: number; // 1 - 12
  day?: number;
  monthName: string; // "Sep", "Aug", etc.
  fullMonthName: string; // "September", "August", etc.
  displayDate: string; // "Sep 28, 2026" or "Sep 2026"
  timestamp: number;
}

export interface TimelineCertification extends Certification {
  parsedDate: ParsedCertDate;
}

export interface MonthGroup {
  monthKey: string; // "2026-09"
  year: number;
  month: number;
  monthName: string;
  fullMonthName: string;
  certs: TimelineCertification[];
}

export interface YearGroup {
  year: number;
  totalCount: number;
  months: MonthGroup[];
}

const MONTH_MAP: Record<string, { index: number; short: string; full: string }> = {
  jan: { index: 1, short: 'Jan', full: 'January' },
  january: { index: 1, short: 'Jan', full: 'January' },
  feb: { index: 2, short: 'Feb', full: 'February' },
  february: { index: 2, short: 'Feb', full: 'February' },
  mar: { index: 3, short: 'Mar', full: 'March' },
  march: { index: 3, short: 'Mar', full: 'March' },
  apr: { index: 4, short: 'Apr', full: 'April' },
  april: { index: 4, short: 'Apr', full: 'April' },
  may: { index: 5, short: 'May', full: 'May' },
  jun: { index: 6, short: 'Jun', full: 'June' },
  june: { index: 6, short: 'Jun', full: 'June' },
  jul: { index: 7, short: 'Jul', full: 'July' },
  july: { index: 7, short: 'Jul', full: 'July' },
  aug: { index: 8, short: 'Aug', full: 'August' },
  august: { index: 8, short: 'Aug', full: 'August' },
  sep: { index: 9, short: 'Sep', full: 'September' },
  september: { index: 9, short: 'Sep', full: 'September' },
  oct: { index: 10, short: 'Oct', full: 'October' },
  october: { index: 10, short: 'Oct', full: 'October' },
  nov: { index: 11, short: 'Nov', full: 'November' },
  november: { index: 11, short: 'Nov', full: 'November' },
  dec: { index: 12, short: 'Dec', full: 'December' },
  december: { index: 12, short: 'Dec', full: 'December' },
};

export function parseCertDate(cert: Certification): ParsedCertDate {
  // Check if issueDate is present (e.g. "2026-09-28")
  if (cert.issueDate && /^\d{4}-\d{2}-\d{2}$/.test(cert.issueDate.trim())) {
    const [yStr, mStr, dStr] = cert.issueDate.trim().split('-');
    const year = parseInt(yStr, 10);
    const month = parseInt(mStr, 10);
    const day = parseInt(dStr, 10);
    const dateObj = new Date(year, month - 1, day);
    const monthKey = Object.keys(MONTH_MAP).find(k => MONTH_MAP[k].index === month) || 'jan';
    const monthInfo = MONTH_MAP[monthKey];

    return {
      year,
      month,
      day,
      monthName: monthInfo.short,
      fullMonthName: monthInfo.full,
      displayDate: `${monthInfo.short} ${day}, ${year}`,
      timestamp: dateObj.getTime(),
    };
  }

  // Parse from issued string (e.g. "Aug 24, 2026" or "Sep 2026" or "September 2026")
  const issued = (cert.issued || '').trim();

  // Pattern: "Aug 24, 2026"
  const dayMonthYear = issued.match(/^([a-zA-Z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (dayMonthYear) {
    const mName = dayMonthYear[1].toLowerCase();
    const day = parseInt(dayMonthYear[2], 10);
    const year = parseInt(dayMonthYear[3], 10);
    const mInfo = MONTH_MAP[mName] || { index: 1, short: 'Jan', full: 'January' };
    const dateObj = new Date(year, mInfo.index - 1, day);

    return {
      year,
      month: mInfo.index,
      day,
      monthName: mInfo.short,
      fullMonthName: mInfo.full,
      displayDate: `${mInfo.short} ${day}, ${year}`,
      timestamp: dateObj.getTime(),
    };
  }

  // Pattern: "Sep 2026" or "September 2026"
  const monthYear = issued.match(/^([a-zA-Z]+)\s+(\d{4})$/);
  if (monthYear) {
    const mName = monthYear[1].toLowerCase();
    const year = parseInt(monthYear[2], 10);
    const mInfo = MONTH_MAP[mName] || { index: 1, short: 'Jan', full: 'January' };
    // Assign end-of-month or day based on cert ID order to maintain sequential sort
    const syntheticDay = Math.min(28, Math.max(1, 30 - ((cert.id % 25) || 1)));
    const dateObj = new Date(year, mInfo.index - 1, syntheticDay);

    return {
      year,
      month: mInfo.index,
      monthName: mInfo.short,
      fullMonthName: mInfo.full,
      displayDate: `${mInfo.short} ${year}`,
      timestamp: dateObj.getTime(),
    };
  }

  // Fallback
  return {
    year: 2026,
    month: 1,
    monthName: 'Jan',
    fullMonthName: 'January',
    displayDate: cert.issued || '2026',
    timestamp: new Date(2026, 0, 1).getTime(),
  };
}

export function getTimelineCertifications(certs: Certification[]): TimelineCertification[] {
  return certs
    .map(c => ({
      ...c,
      parsedDate: parseCertDate(c),
    }))
    .sort((a, b) => {
      // Primary sort: Date descending (most recent first)
      if (b.parsedDate.timestamp !== a.parsedDate.timestamp) {
        return b.parsedDate.timestamp - a.parsedDate.timestamp;
      }
      // Secondary sort: id descending
      return b.id - a.id;
    });
}

export function groupCertsByYearAndMonth(certs: Certification[]): YearGroup[] {
  const timelineCerts = getTimelineCertifications(certs);
  const yearMap = new Map<number, Map<string, TimelineCertification[]>>();

  timelineCerts.forEach(cert => {
    const { year, month } = cert.parsedDate;
    if (!yearMap.has(year)) {
      yearMap.set(year, new Map());
    }

    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    const monthsMap = yearMap.get(year)!;
    if (!monthsMap.has(monthKey)) {
      monthsMap.set(monthKey, []);
    }
    monthsMap.get(monthKey)!.push(cert);
  });

  const yearGroups: YearGroup[] = [];

  // Sort years descending
  const sortedYears = Array.from(yearMap.keys()).sort((a, b) => b - a);

  sortedYears.forEach(year => {
    const monthsMap = yearMap.get(year)!;
    const sortedMonthKeys = Array.from(monthsMap.keys()).sort((a, b) => b.localeCompare(a));
    const monthGroups: MonthGroup[] = [];
    let yearTotal = 0;

    sortedMonthKeys.forEach(mKey => {
      const monthCerts = monthsMap.get(mKey)!;
      yearTotal += monthCerts.length;
      const firstCert = monthCerts[0];

      monthGroups.push({
        monthKey: mKey,
        year,
        month: firstCert.parsedDate.month,
        monthName: firstCert.parsedDate.monthName,
        fullMonthName: firstCert.parsedDate.fullMonthName,
        certs: monthCerts,
      });
    });

    yearGroups.push({
      year,
      totalCount: yearTotal,
      months: monthGroups,
    });
  });

  return yearGroups;
}

export interface IssuerStyle {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeTextColor: string;
}

export function getIssuerStyle(issuer: string): IssuerStyle {
  const norm = issuer.toLowerCase();
  if (norm.includes('microsoft')) {
    return {
      name: 'Microsoft',
      color: '#00A4EF',
      bgColor: 'rgba(0, 164, 239, 0.12)',
      borderColor: 'rgba(0, 164, 239, 0.35)',
      badgeTextColor: '#38bdf8',
    };
  }
  if (norm.includes('oracle')) {
    return {
      name: 'Oracle',
      color: '#F80000',
      bgColor: 'rgba(248, 0, 0, 0.12)',
      borderColor: 'rgba(248, 0, 0, 0.35)',
      badgeTextColor: '#f87171',
    };
  }
  if (norm.includes('google')) {
    return {
      name: 'Google Cloud',
      color: '#4285F4',
      bgColor: 'rgba(66, 133, 244, 0.12)',
      borderColor: 'rgba(66, 133, 244, 0.35)',
      badgeTextColor: '#60a5fa',
    };
  }
  if (norm.includes('atlassian')) {
    return {
      name: 'Atlassian',
      color: '#0052CC',
      bgColor: 'rgba(0, 82, 204, 0.12)',
      borderColor: 'rgba(38, 132, 255, 0.35)',
      badgeTextColor: '#93c5fd',
    };
  }
  if (norm.includes('asana')) {
    return {
      name: 'Asana',
      color: '#F06A6A',
      bgColor: 'rgba(240, 106, 106, 0.12)',
      borderColor: 'rgba(240, 106, 106, 0.35)',
      badgeTextColor: '#fb7185',
    };
  }
  if (norm.includes('ibm') || norm.includes('confluent')) {
    return {
      name: 'IBM / Confluent',
      color: '#0F62FE',
      bgColor: 'rgba(15, 98, 254, 0.12)',
      borderColor: 'rgba(15, 98, 254, 0.35)',
      badgeTextColor: '#818cf8',
    };
  }
  if (norm.includes('new relic')) {
    return {
      name: 'New Relic',
      color: '#1CE783',
      bgColor: 'rgba(28, 231, 131, 0.12)',
      borderColor: 'rgba(28, 231, 131, 0.35)',
      badgeTextColor: '#34d399',
    };
  }
  if (norm.includes('hashicorp')) {
    return {
      name: 'HashiCorp',
      color: '#E535AB',
      bgColor: 'rgba(229, 53, 171, 0.12)',
      borderColor: 'rgba(229, 53, 171, 0.35)',
      badgeTextColor: '#f472b6',
    };
  }
  return {
    name: issuer,
    color: '#38BDF8',
    bgColor: 'rgba(56, 189, 248, 0.12)',
    borderColor: 'rgba(56, 189, 248, 0.35)',
    badgeTextColor: '#38bdf8',
  };
}

export function getLevelBadgeStyle(level: CertLevel) {
  switch (level) {
    case 'Expert':
    case 'Professional':
      return {
        label: level,
        color: '#F59E0B',
        bgColor: 'rgba(245, 158, 11, 0.15)',
        borderColor: 'rgba(245, 158, 11, 0.4)',
      };
    case 'Specialty':
      return {
        label: level,
        color: '#10B981',
        bgColor: 'rgba(16, 185, 129, 0.15)',
        borderColor: 'rgba(16, 185, 129, 0.4)',
      };
    case 'Associate':
      return {
        label: level,
        color: '#0EA5E9',
        bgColor: 'rgba(14, 165, 233, 0.15)',
        borderColor: 'rgba(14, 165, 233, 0.4)',
      };
    default:
      return {
        label: level || 'Foundations',
        color: '#818CF8',
        bgColor: 'rgba(129, 140, 248, 0.15)',
        borderColor: 'rgba(129, 140, 248, 0.4)',
      };
  }
}
