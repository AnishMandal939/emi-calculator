export interface LoanInput {
  principal: number;
  annualRatePercent: number;
  tenureMonths: number;
}

export interface AmortizationYear {
  year: number;
  installments: number;
  principal: number;
  interest: number;
  totalPayment: number;
  balance: number;
}

export function calculateEmi({
  principal,
  annualRatePercent,
  tenureMonths,
}: LoanInput): number {
  if (principal <= 0 || tenureMonths <= 0 || annualRatePercent < 0) {
    throw new Error(
      'Loan principal and tenure must be positive; rate cannot be negative.',
    );
  }

  const monthlyRate = annualRatePercent / (12 * 100);
  if (monthlyRate === 0) {
    return principal / tenureMonths;
  }

  const compound = (1 + monthlyRate) ** tenureMonths;
  return (principal * monthlyRate * compound) / (compound - 1);
}

export function amortizeByCalendarYear(
  input: LoanInput,
  firstYearInstallments = 12,
): AmortizationYear[] {
  const emi = calculateEmi(input);
  const monthlyRate = input.annualRatePercent / (12 * 100);
  const years: AmortizationYear[] = [];
  let balance = input.principal;
  let month = 0;
  let year = 1;

  while (month < input.tenureMonths) {
    const installments =
      year === 1
        ? Math.min(firstYearInstallments, input.tenureMonths)
        : Math.min(12, input.tenureMonths - month);

    if (installments <= 0) {
      throw new Error('The first calendar-year installment count must be positive.');
    }

    let principalPaid = 0;
    let interestPaid = 0;
    let totalPayment = 0;

    for (let installment = 0; installment < installments; installment += 1) {
      const interest = balance * monthlyRate;
      const principalComponent = Math.min(balance, emi - interest);
      const payment = principalComponent + interest;

      balance = Math.max(0, balance - principalComponent);
      principalPaid += principalComponent;
      interestPaid += interest;
      totalPayment += payment;
      month += 1;

      if (balance < 1e-7 || month === input.tenureMonths) {
        balance = 0;
        break;
      }
    }

    years.push({
      year,
      installments: month - years.reduce((sum, row) => sum + row.installments, 0),
      principal: principalPaid,
      interest: interestPaid,
      totalPayment,
      balance,
    });
    year += 1;
  }

  return years;
}
