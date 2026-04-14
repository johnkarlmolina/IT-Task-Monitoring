import type { Holiday } from '../interfaces';

const PH_HOLIDAYS_2026: Holiday[] = [
  // Regular Holidays
  { date: '2026-01-01', name: "New Year's Day", type: 'Regular' },
  { date: '2026-04-02', name: 'Maundy Thursday', type: 'Regular' },
  { date: '2026-04-03', name: 'Good Friday', type: 'Regular' },
  { date: '2026-04-09', name: 'Araw ng Kagitingan', type: 'Regular' },
  { date: '2026-05-01', name: 'Labor Day', type: 'Regular' },
  { date: '2026-06-12', name: 'Independence Day', type: 'Regular' },
  { date: '2026-08-31', name: 'National Heroes Day', type: 'Regular' },
  { date: '2026-11-30', name: 'Bonifacio Day', type: 'Regular' },
  { date: '2026-12-25', name: 'Christmas Day', type: 'Regular' },
  { date: '2026-12-30', name: 'Rizal Day', type: 'Regular' },

  // Special (Non-Working) Holidays
  { date: '2026-02-17', name: 'Chinese New Year', type: 'SpecialNonWorking' },
  { date: '2026-04-04', name: 'Black Saturday', type: 'SpecialNonWorking' },
  { date: '2026-08-21', name: 'Ninoy Aquino Day', type: 'SpecialNonWorking' },
  { date: '2026-11-01', name: "All Saints' Day", type: 'SpecialNonWorking' },
  { date: '2026-11-02', name: "All Souls' Day", type: 'SpecialNonWorking' },
  { date: '2026-12-08', name: 'Feast of the Immaculate Conception of Mary', type: 'SpecialNonWorking' },
  { date: '2026-12-24', name: 'Christmas Eve', type: 'SpecialNonWorking' },
  { date: '2026-12-31', name: 'Last Day of the Year', type: 'SpecialNonWorking' },

  // Special (Working) Holidays
  { date: '2026-02-25', name: 'EDSA People Power Revolution Anniversary', type: 'SpecialWorking' },
];

export const getPhilippinesHolidaysForYear = (year: number): Holiday[] => {
  if (year === 2026) return PH_HOLIDAYS_2026;
  return [];
};
