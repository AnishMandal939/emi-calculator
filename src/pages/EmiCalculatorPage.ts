import { expect, type Locator, type Page } from '@playwright/test';
import * as XLSX from 'xlsx';
import { Element } from '@elements';
import {
  amortizeByCalendarYear,
  calculateEmi,
  type AmortizationYear,
  type LoanInput,
} from '@oracle/emi';
import { TOLERANCE, expectWithinTolerance } from '@utils/tolerance';
import { parseIndianNumber } from '@utils/parse';
import { BasePage } from './BasePage';

const SEL = {
  heading:
    'h1:has-text("EMI Calculator for Home Loan, Car Loan & Personal Loan in India")',
  loanAmount: '#loanamount',
  interestRate: '#loaninterest',
  loanTenure: '#loanterm',
  emi: '#emiamount span',
  sliderTracks: '.ui-slider',
  sliderHandles: '.ui-slider-handle',
  yearMonthToggle: '#loanmonths',
  yearMonthToggleLabel: 'label:has(#loanmonths)',
  yearsToggle: '#loanyears',
  yearsToggleLabel: 'label:has(#loanyears)',
  chart: '#emibarchart svg',
  annualRows: '#emipaymenttable tr.yearlypaymentdetails',
  tableRows: '#emipaymenttable tr.yearlypaymentdetails',
  tableCell: 'td',
  exportExcel: '.ecaldownloadexcel',
  totalInterest: '#emitotalinterest',
  totalPayment: '#emitotalamount',
} as const;

type EmiElementName =
  | 'heading'
  | 'loanAmount'
  | 'interestRate'
  | 'loanTenure'
  | 'emi'
  | 'amountSlider'
  | 'rateSlider'
  | 'tenureSlider'
  | 'yearMonthToggle'
  | 'chart'
  | 'table'
  | 'exportExcel'
  | 'totalInterest'
  | 'totalPayment';

export interface PaymentRow {
  year: string;
  principal: number;
  interest: number;
  totalPayment: number;
  balance: number;
}

export interface ChartSeries {
  interest: number[];
  principal: number[];
  balance: number[];
}

export class EmiCalculatorPage extends BasePage<EmiElementName> {
  constructor(page: Page) {
    super(page);
    this.elements.set('heading', new Element(page.locator(SEL.heading)));
    this.elements.set('loanAmount', new Element(page.locator(SEL.loanAmount)));
    this.elements.set('interestRate', new Element(page.locator(SEL.interestRate)));
    this.elements.set('loanTenure', new Element(page.locator(SEL.loanTenure)));
    this.elements.set('emi', new Element(page.locator(SEL.emi)));
    this.elements.set(
      'amountSlider',
      new Element(page.locator(SEL.sliderHandles).nth(0)),
    );
    this.elements.set(
      'rateSlider',
      new Element(page.locator(SEL.sliderHandles).nth(1)),
    );
    this.elements.set(
      'tenureSlider',
      new Element(page.locator(SEL.sliderHandles).nth(2)),
    );
    this.elements.set('yearMonthToggle', new Element(page.locator(SEL.yearMonthToggle)));
    this.elements.set('chart', new Element(page.locator(SEL.chart)));
    this.elements.set('table', new Element(page.locator(SEL.tableRows)));
    this.elements.set('exportExcel', new Element(page.locator(SEL.exportExcel)));
    this.elements.set('totalInterest', new Element(page.locator(SEL.totalInterest)));
    this.elements.set('totalPayment', new Element(page.locator(SEL.totalPayment)));
  }

  async visit(): Promise<void> {
    await this.page.goto('/');
    await this.execute({ sName: 'heading', configs: [{ type: 'visible' }] });
  }

  async setSliderByRatio(
    slider: 'amountSlider' | 'rateSlider' | 'tenureSlider',
    ratio: number,
  ): Promise<void> {
    await this.execute({
      sName: slider,
      configs: [{ type: 'setByRatio', ratio }],
    });
  }

  async nudgeSlider(
    slider: 'amountSlider' | 'rateSlider' | 'tenureSlider',
    key: 'ArrowLeft' | 'ArrowRight',
    count = 1,
  ): Promise<void> {
    await this.execute({
      sName: slider,
      configs: [{ type: 'keyboardNudge', key, count }],
    });
  }

  async readLoanInput(): Promise<LoanInput> {
    const [principal, annualRatePercent, years] = await Promise.all([
      this.page.locator(SEL.loanAmount).inputValue(),
      this.page.locator(SEL.interestRate).inputValue(),
      this.page.locator(SEL.loanTenure).inputValue(),
    ]);
    const monthsSelected = await this.page.locator(SEL.yearMonthToggle).isChecked();

    return {
      principal: parseIndianNumber(principal),
      annualRatePercent: parseIndianNumber(annualRatePercent),
      tenureMonths: parseIndianNumber(years) * (monthsSelected ? 1 : 12),
    };
  }

  async readEmi(): Promise<number> {
    const text = await this.page.locator(SEL.emi).innerText();
    return parseIndianNumber(text);
  }

  async readTotalInterest(): Promise<number> {
    return this.readSummaryAmount(SEL.totalInterest);
  }

  async readTotalPayment(): Promise<number> {
    return this.readSummaryAmount(SEL.totalPayment);
  }

  private async readSummaryAmount(selector: string): Promise<number> {
    const text = await this.page.locator(selector).innerText();
    const amount = text.match(/₹\s*([\d,]+(?:\.\d+)?)/)?.[1];
    if (!amount) {
      throw new Error(`Could not find a rupee amount in summary text "${text}".`);
    }
    return parseIndianNumber(amount);
  }

  async readPaymentTable(): Promise<PaymentRow[]> {
    await this.page.locator(SEL.tableRows).first().waitFor();
    return this.page.locator(SEL.tableRows).evaluateAll(
      (rows, cellSelector) =>
        rows.flatMap((row) => {
          const cells = row.querySelectorAll(cellSelector);
          if (cells.length < 5) {
            return [];
          }
          const numberAt = (index: number): number =>
            Number((cells[index].textContent ?? '').replace(/[₹,\s]/g, ''));

          return [
            {
              year: cells[0].textContent?.trim() ?? '',
              principal: numberAt(1),
              interest: numberAt(2),
              totalPayment: numberAt(3),
              balance: numberAt(4),
            },
          ];
        }),
      SEL.tableCell,
    );
  }

  async readChartSeries(): Promise<ChartSeries> {
    await this.page.locator(SEL.chart).waitFor();
    return this.page.evaluate(() => {
      const chartWindow = window as typeof window & {
        Highcharts?: {
          charts?: Array<{
            renderTo?: { id?: string };
            series?: Array<{ data?: Array<{ y?: number }> }>;
          }>;
        };
      };
      const chart = chartWindow.Highcharts?.charts?.find(
        (candidate) => candidate?.renderTo?.id === 'emibarchart',
      );
      if (!chart) {
        throw new Error('Highcharts chart not found after chart SVG became visible.');
      }

      const valuesAt = (index: number): number[] =>
        chart.series?.[index]?.data?.map((point) => Math.round(point.y ?? 0)) ?? [];
      return {
        interest: valuesAt(0),
        principal: valuesAt(1),
        balance: valuesAt(2),
      };
    });
  }

  async expectedTableFromOracle(): Promise<AmortizationYear[]> {
    const loan = await this.readLoanInput();
    const emi = calculateEmi(loan);
    const actualRows = await this.readPaymentTable();
    const firstYearInstallments = actualRows.length
      ? Math.round(actualRows[0].totalPayment / emi)
      : 12;

    return amortizeByCalendarYear(loan, firstYearInstallments);
  }

  async validateEmi(): Promise<void> {
    const [loan, actualEmi] = await Promise.all([this.readLoanInput(), this.readEmi()]);
    expectWithinTolerance(actualEmi, calculateEmi(loan), TOLERANCE.emi);
  }

  async validateSummary(): Promise<void> {
    const loan = await this.readLoanInput();
    const emi = calculateEmi(loan);
    const expectedYears = await this.expectedTableFromOracle();
    const expectedInterest = expectedYears.reduce((sum, row) => sum + row.interest, 0);
    expectWithinTolerance(
      await this.readTotalInterest(),
      Math.round(expectedInterest),
      TOLERANCE.row,
    );
    expectWithinTolerance(
      await this.readTotalPayment(),
      Math.round(emi * loan.tenureMonths),
      TOLERANCE.row,
    );
  }

  async validateYearTable(): Promise<void> {
    const [actualRows, expectedRows] = await Promise.all([
      this.readPaymentTable(),
      this.expectedTableFromOracle(),
    ]);

    expect(actualRows.length).toBe(expectedRows.length);
    actualRows.forEach((actual, index) => {
      const expected = expectedRows[index];
      expectWithinTolerance(
        actual.principal,
        Math.round(expected.principal),
        TOLERANCE.row,
      );
      expectWithinTolerance(
        actual.interest,
        Math.round(expected.interest),
        TOLERANCE.row,
      );
      expectWithinTolerance(
        actual.totalPayment,
        Math.round(expected.totalPayment),
        TOLERANCE.row,
      );
      expectWithinTolerance(actual.balance, Math.round(expected.balance), TOLERANCE.row);
    });

    expect(actualRows.at(-1)?.balance).toBe(0);
  }

  async validateChartAgainstTable(): Promise<void> {
    const [series, rows] = await Promise.all([
      this.readChartSeries(),
      this.readPaymentTable(),
    ]);

    expect(series.principal.length).toBe(rows.length);
    rows.forEach((row, index) => {
      expectWithinTolerance(series.principal[index], row.principal, TOLERANCE.chart);
      expectWithinTolerance(series.interest[index], row.interest, TOLERANCE.chart);
      expectWithinTolerance(series.balance[index], row.balance, TOLERANCE.chart);
    });
  }

  async validateExcelAgainstTable(): Promise<void> {
    const loan = await this.readLoanInput();
    const emi = calculateEmi(loan);
    const expectedYears = await this.expectedTableFromOracle();
    const expectedInterest = Math.round(
      expectedYears.reduce((sum, row) => sum + row.interest, 0),
    );
    const expectedTotalPayment = Math.round(emi * loan.tenureMonths);
    const rows = await this.readPaymentTable();
    const downloadPromise = this.page.waitForEvent('download');
    await this.execute({ sName: 'exportExcel', configs: [{ type: 'click' }] });
    const download = await downloadPromise;
    const filePath = await download.path();
    if (!filePath) {
      throw new Error('Excel download did not provide a local file path.');
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new Error('Downloaded Excel workbook contains no sheets.');
    }

    const exported = XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[sheetName], {
      header: 1,
      defval: '',
    });
    const readSummaryValue = (label: string): number => {
      const row = exported.find((item) => item[0] === label);
      const value = row?.[1];
      if (typeof value !== 'number') {
        throw new Error(`Excel summary value "${label}" was not found.`);
      }
      return value;
    };
    expect(exported.length).toBeGreaterThan(12);
    expectWithinTolerance(readSummaryValue('Loan EMI'), Math.round(emi), TOLERANCE.excel);
    expectWithinTolerance(
      readSummaryValue('Total Interest Payable'),
      expectedInterest,
      TOLERANCE.excel,
    );
    expectWithinTolerance(
      readSummaryValue('Total Payment (Principal + Interest)'),
      expectedTotalPayment,
      TOLERANCE.excel,
    );

    const headerIndex = exported.findIndex(
      (row) => row[0] === 'Month #' && row[2] === 'Principal (A)',
    );
    if (headerIndex < 0) {
      throw new Error('Excel amortization schedule headers were not found.');
    }
    const monthlyRows = exported
      .slice(headerIndex + 1)
      .filter((row) => typeof row[0] === 'number');
    expect(monthlyRows).toHaveLength(loan.tenureMonths);
    const exportedPrincipal = monthlyRows.reduce((sum, row) => sum + Number(row[2]), 0);
    const finalBalance = Number(monthlyRows.at(-1)?.[5]);
    expectWithinTolerance(exportedPrincipal, loan.principal, TOLERANCE.excel);
    expect(finalBalance).toBe(0);

    const annualTotals = new Map<
      number,
      { principal: number; interest: number; balance: number }
    >();
    monthlyRows.forEach((row) => {
      const dateText = String(row[1]);
      const year = Number(dateText.slice(-4));
      const yearTotals = annualTotals.get(year) ?? {
        principal: 0,
        interest: 0,
        balance: 0,
      };
      yearTotals.principal += Number(row[2]);
      yearTotals.interest += Number(row[3]);
      yearTotals.balance = Number(row[5]);
      annualTotals.set(year, yearTotals);
    });
    expect(annualTotals.size).toBe(rows.length);
    rows.forEach((row) => {
      const year = Number(row.year);
      const annual = annualTotals.get(year);
      if (!annual) {
        throw new Error(`Excel schedule does not contain calendar year ${year}.`);
      }
      expectWithinTolerance(annual.principal, row.principal, TOLERANCE.row);
      expectWithinTolerance(annual.interest, row.interest, TOLERANCE.row);
      expectWithinTolerance(annual.balance, row.balance, TOLERANCE.excel);
      expectWithinTolerance(
        annual.principal + annual.interest,
        row.totalPayment,
        TOLERANCE.row,
      );
    });
  }

  async validateYearMonthToggle(): Promise<void> {
    await this.page.locator(SEL.yearMonthToggleLabel).click();
    await expect(this.page.locator(SEL.yearMonthToggle)).toBeChecked();
    await expect(this.page.locator(SEL.annualRows).first()).toBeVisible();
    await this.page.locator(SEL.yearsToggleLabel).click();
    await expect(this.page.locator(SEL.yearsToggle)).toBeChecked();
  }

  async setLoanAmountInput(value: string): Promise<void> {
    await this.execute({
      sName: 'loanAmount',
      configs: [
        { type: 'type', value },
        { type: 'press', key: 'Tab' },
      ],
    });
  }

  async paymentTableLocator(): Promise<Locator> {
    return this.page.locator(SEL.tableRows);
  }
}
