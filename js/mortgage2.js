function mortgageLoop(loopInfo) {
  const { num, pay, year, month, mortgage, ir } = loopInfo;
  let { teq, rl, tpa } = loopInfo;
  for (let i = 0; i < num; i++) { // changed overpayment to $pay
    const intr = rl * ir; //interest
    const eqp = pay - intr; //equity payment
    teq += eqp; //total equity
    mortgage.push([new Date(year, month + i, 1), intr, eqp, intr + eqp]);
    rl = rl - eqp; //remaining loan
    tpa += pay; //total payed
  }
  return { teq, mortgage, rl, tpa };
}

function firstMortgage() {
  const il = 176225; //initial loan
  const hpi = Math.max(il + 9275, Number(getSavedValue("HPI")));    // set the value to this input
  const teq = hpi - il; //total equity, initial deposit plus HPI
  const rl = il, tpa = 0; //remaining loan, total payed

  const mortgage = [];
  const ir = 4.09 / 12 / 100; //initial interest rate
  let loopInfo = { num: 13, pay: 1000, year: 2017, month: 3, ir, teq, rl, tpa, mortgage };
  const info = mortgageLoop(loopInfo);

  loopInfo = { num: 11, pay: 1100, year: 2018, month: 4, ir, ...info }; // changed overpayment to £1100
  return mortgageLoop(loopInfo);
}

function secondMortgage(info) {
  const ir = 1.84 / 12 / 100; //remortgage rate  
  let { rl, tpa } = info;
  const fees = 995; //the £995 was te remortgage fee
  tpa += -fees;
  rl += fees;
  let loopInfo = { num: 1, pay: 1100, year: 2019, month: 3, ir, ...info, rl, tpa }; // First month
  info = mortgageLoop(loopInfo);

  loopInfo = { num: 14, pay: 1200, year: 2019, month: 4, ir, ...info }; // changed overpayment to £1200
  info = mortgageLoop(loopInfo);

  loopInfo = { num: 9, pay: 1500, year: 2020, month: 6, ir, ...info }; // changed overpayment to £1500
  return mortgageLoop(loopInfo);
}

function thirdMortgage(info) {
  const today = new Date();
  const ir = 1.59 / 12 / 100; //remortgage rate
  let { rl, tpa } = info;
  const fees = -5814.12 - 250 + 66 - 5.88; //the £5814.12 was the shortfall since we borrowed £135k, the £250 is cashback, £66 fees, £5.88 extra first month
  tpa += -fees;
  rl += fees;
  loopInfo = { num: 24, pay: 1200, year: 2021, month: 3, ir, ...info, rl, tpa }; // changed overpayment to £1200 since baby is coming
  return mortgageLoop(loopInfo);
}

function currentMortgage(info) {
  const today = new Date();
  const monthd = (today - new Date(2023, 3, 1)) / 1000 / 60 / 60 / 24 / 365.25 * 12; //difference in month
  const ir = 3.35 / 12 / 100; //remortgage rate
  let { rl, tpa } = info;
  const fees = -3600.22 + 995;
  tpa += -fees; //the £3600.22 was the shortfall since we borrowed £108k, the £995 was te remortgage fee
  rl += fees;
  loopInfo = { num: monthd, pay: 771.18, year: 2023, month: 3, ir, ...info, rl }; // changed overpayment to £1200 since baby is coming
  return { monthd, ...mortgageLoop(loopInfo) };
}

function futureMortgage(info) {
  const { mortgage, tp, monthd } = info;
  let { rl } = info;
  let pn = 0; //payment number
  const ir = 3.35 / 12 / 100; //remortgage rate
  for (let i = 0; rl > 0; i++) {
    const intr = rl * ir;
    const eqp = tp - intr;
    mortgage.push([new Date(2023, 4 + i + monthd, 1), intr, eqp, intr + eqp]);
    rl = rl - eqp;
    pn++;
  }
  return pn;
}

function calculations() {
  const mpc = 771.18;  //current mortgage payment
  const op = Number(getSavedValue("OP"));
  const tp = op + mpc; // total payment
  let info = firstMortgage();
  info = secondMortgage(info);
  info = thirdMortgage(info);
  const { teq, mortgage, rl, tpa } = info = currentMortgage(info);
  const pn = futureMortgage({ tp, ...info });

  const ltv = 100 - teq / (teq + rl) * 100; //Loan to value
  spanMon("TPA", tpa);
  spanMon("TEQ", teq);
  spanMon("MPN", mpc);
  spanMon("TP", tp);
  spanMon("RD", rl);
  spanMon("MOP", rl / 120);
  document.getElementById("LTV").textContent = ltv.toFixed(0) + " %";

  const oplabel = document.getElementById("MOP");
  oplabel.className = ((rl / 120) < op) ? `label danger` : `label safe`;
  document.getElementById("RT").textContent = `${Math.floor((pn) / 12)} y ${(12 * ((pn) / 12 - Math.floor(pn / 12))).toFixed(0)} m`;
  dygPlot(mortgage);
}

function dygPlot(mortgage) {
  try {
    if (typeof g3 !== 'undefined') g3.destroy();
  } catch (e) { logError(e); }
  window.g3 = new Dygraph(
    document.getElementById("graphdiv3"),
    mortgage,
    {
      legend: 'always',
      labels: ['Date', 'Interest', 'Equity', 'Payment'],
      xlabel: "Dates",
      ylabel: "Payments (£)",
      fillGraph: true,
      connectSeparatedPoints: true,
      axes: {
        y: {
          axisLabelFormatter(y) { return `${y} £` },
          axisLabelWidth: 60
        }
      }
    }          // options
  );
  setTimeout(function () {
    window.dispatchEvent(new Event('resize'));
  }, 500);
}

const spanMon = (span, cont) => document.getElementById(span).textContent = `${(cont).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/gu, ",")}  £`;

//startup
document.querySelectorAll('input[type=number]').forEach(inp => inp.value = getSavedValue(inp.id));
calculations();
document.onkeyup = function () {
  calculations();
};