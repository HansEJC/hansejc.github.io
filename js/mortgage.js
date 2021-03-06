function calculations(){
  document.querySelectorAll('input[type=number]').forEach(inp => inp.value = getSavedValue(inp.id));
  let ab = Number(getSavedValue("AB"));    // set the value to this input
  let ir = Number(getSavedValue("IR"))/12/100;
  let mt = Number(getSavedValue("MT"))*12;
  let mp = ab*((ir*Math.pow((1+ir),mt))/(Math.pow((1+ir),mt)-1));

  spanToMoney("MP",mp);
  let today = new Date();

  let mortgage = [];
  let intr,eqp, pn, i, data; //interest, equity payment,remaining loan, payment number
  pn = 0;

  let op = Number(getSavedValue("OP"));
  let tp = op+mp;
  spanToMoney("TP",tp);
  spanToMoney("MOP",ab/120);
  
  const mop = document.getElementById("MOP");
  mop.className = (ab/120)<op ? 'label danger' : 'label safe';

  let start = 0, max = 10000;
  for (i = 0; ab > 0; i++) {
    intr = ab*ir;
    eqp = tp-intr;
    data = [new Date(today.getFullYear(),today.getMonth()+i,today.getDate()), intr, eqp, intr+eqp];
    mortgage.push(data);
    ab = ab-eqp;
    pn++;
    start+=1;
    if(start>max)break;
  }

  document.getElementById("RT").textContent = Math.floor((pn)/12)+" y " + (12*((pn)/12-Math.floor(pn/12))).toFixed(0)+" m";
  spanToMoney("AP",pn*tp);
  dygPlot(mortgage);  
}

function dygPlot(mortgage) {
  try {
    if (typeof g3 !== 'undefined') g3.destroy();
  }catch(e){logError(e);}
  if (mortgage.length < 2) return;
  window.g3 = new Dygraph(
    document.getElementById("graphdiv3"),
    mortgage,
    {
      legend: 'always',
      labels: [ 'Date', 'Interest','Equity', 'Payment'],
      xlabel: "Dates",
      ylabel: "Payments (£)",
      fillGraph: true,
      connectSeparatedPoints: true,
      axes: {
        y: {
          axisLabelFormatter: function(y) {
            return  smoothdec(y) + ' £';
          },
          axisLabelWidth: 60
        }
      }
    }          // options
  );
  setTimeout(function(){
    window.dispatchEvent(new Event('resize'));
  }, 500);
}

const spanToMoney = (span,cont) => document.getElementById(span).textContent = (cont).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/gu, ",")+" £";

//startup
calculations();
document.onkeyup = function() {
  calculations();
};