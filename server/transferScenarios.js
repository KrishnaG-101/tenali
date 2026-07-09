/**
 * server/transferScenarios.js
 *
 * Parametric template-based learning transfer scenarios for:
 *   - Percentages ('percent')
 *   - Ratio & Proportion ('ratio')
 *   - Fraction Addition ('fractionadd')
 */

function gcd(a, b) {
  return b ? gcd(b, a % b) : Math.abs(a);
}

function simplifyFraction(num, den) {
  const g = gcd(num, den);
  const sNum = num / g;
  const sDen = den / g;
  if (sDen === 1) return String(sNum);
  return `${sNum}/${sDen}`;
}

const percentScenarios = [
  {
    scenarioId: 'pct-transfer-001',
    context: 'shopping',
    transferLevel: 2,
    icon: '🛒',
    generate: () => {
      const names = ['Arjun', 'Priya', 'Meena', 'Ravi', 'Ananya'];
      const items = ['shirt', 'laptop bag', 'pair of shoes', 'watch', 'schoolbag'];
      const prices = [500, 800, 1200, 1500, 2000, 2500, 3000];
      const discounts = [10, 15, 20, 25, 30];
      const gsts = [5, 12, 18];

      const name = names[Math.floor(Math.random() * names.length)];
      const item = items[Math.floor(Math.random() * items.length)];
      const price = prices[Math.floor(Math.random() * prices.length)];
      const discount = discounts[Math.floor(Math.random() * discounts.length)];
      const gst = gsts[Math.floor(Math.random() * gsts.length)];

      const vars = { name, item, price, discount, gst };
      const res = evaluatePct001(vars);

      return {
        scenarioId: 'pct-transfer-001',
        context: 'shopping',
        prompt: `${name} wants to buy a ${item} priced at ₹${price}. The store offers a ${discount}% discount. After the discount, ${gst}% GST is applied. What is the final price?`,
        variables: vars,
        hints: [
          'Break this into steps: first find the discounted price, then apply the GST to that discounted price.',
          `The discount is ${discount}% of ₹${price} (which is ₹${res.discountAmt}). The discounted price is ₹${price} - ₹${res.discountAmt} = ₹${res.discountedDisplay}. Now find the GST.`,
          `The GST is ${gst}% of ₹${res.discountedDisplay} (which is ₹${res.gstAmt}). Add this to the discounted price to get the final answer.`
        ]
      };
    },
    evaluate: (vars) => evaluatePct001(vars).answer,
    explanation: (vars) => {
      const res = evaluatePct001(vars);
      return `Step 1: Find ${vars.discount}% discount on ₹${vars.price} → ₹${res.discountAmt}\n` +
             `Step 2: Subtract discount → ₹${vars.price} - ₹${res.discountAmt} = ₹${res.discountedDisplay}\n` +
             `Step 3: Find ${vars.gst}% GST on ₹${res.discountedDisplay} → ₹${res.gstAmt}\n` +
             `Step 4: Add GST → ₹${res.discountedDisplay} + ₹${res.gstAmt} = ₹${res.answer}`;
    },
    transferMapping: "The word 'discount' means computing a percentage and subtracting. 'GST' (Goods & Services Tax) means computing a percentage and adding to the discounted price."
  },
  {
    scenarioId: 'pct-transfer-002',
    context: 'sports',
    transferLevel: 2,
    icon: '🏏',
    generate: () => {
      const teams = ['India', 'Australia', 'England', 'South Africa', 'New Zealand'];
      const targets = [200, 240, 250, 300, 320];
      const oversList = [10, 20, 30];
      const rates = [4.5, 5, 5.5, 6, 6.5];

      const team = teams[Math.floor(Math.random() * teams.length)];
      const target = targets[Math.floor(Math.random() * targets.length)];
      const overs = oversList[Math.floor(Math.random() * oversList.length)];
      const rate = rates[Math.floor(Math.random() * rates.length)];

      const vars = { team, target, overs, rate };
      const res = evaluatePct002(vars);

      return {
        scenarioId: 'pct-transfer-002',
        context: 'sports',
        prompt: `The ${team} cricket team needs to score ${target} runs to win. In the first ${overs} overs, they score at a rate of ${rate} runs per over. What percentage of the target runs have they already scored?`,
        variables: vars,
        hints: [
          'First calculate the total runs scored in the first few overs by multiplying the run rate by the number of overs.',
          `They scored ${overs} × ${rate} = ${res.runs} runs. Now, find what percentage ${res.runs} is of ${target}.`,
          `Calculate (${res.runs} / ${target}) × 100 to get the percentage.`
        ]
      };
    },
    evaluate: (vars) => evaluatePct002(vars).answer,
    explanation: (vars) => {
      const res = evaluatePct002(vars);
      return `Step 1: Calculate runs scored → ${vars.overs} overs × ${vars.rate} runs/over = ${res.runs} runs\n` +
             `Step 2: Find percentage of target runs → (${res.runs} / ${vars.target}) × 100 = ${res.answer}%`;
    },
    transferMapping: "A 'run rate' is the average number of runs scored per over. To find what percentage 'a' is of 'b', compute (a / b) × 100."
  },
  {
    scenarioId: 'pct-transfer-003',
    context: 'cooking',
    transferLevel: 3,
    icon: '🍕',
    generate: () => {
      const dishes = ['Kheer', 'Halwa', 'Gulab Jamun', 'Biryani'];
      const servingsList = [4, 5, 8];
      const scalingOptions = {
        4: [6, 8, 10],
        5: [8, 10, 12],
        8: [10, 12, 16]
      };
      const sugars = [100, 150, 200, 250, 300];

      const dish = dishes[Math.floor(Math.random() * dishes.length)];
      const servings = servingsList[Math.floor(Math.random() * servingsList.length)];
      const nextServingsList = scalingOptions[servings];
      const newServings = nextServingsList[Math.floor(Math.random() * nextServingsList.length)];
      const sugar = sugars[Math.floor(Math.random() * sugars.length)];

      const vars = { dish, servings, newServings, sugar };
      const res = evaluatePct003(vars);

      return {
        scenarioId: 'pct-transfer-003',
        context: 'cooking',
        prompt: `A recipe for ${dish} serves ${servings} people and requires ${sugar}g of sugar. If you want to make the dish for ${newServings} people, by what percentage must you increase the amount of sugar?`,
        variables: vars,
        hints: [
          `Notice that the amount of sugar (${sugar}g) is a distractor! The sugar increase percentage is identical to the servings increase percentage.`,
          `Calculate the percentage increase in servings from ${servings} to ${newServings}.`,
          `The formula is: ((New Servings - Original Servings) / Original Servings) × 100.`
        ]
      };
    },
    evaluate: (vars) => evaluatePct003(vars).answer,
    explanation: (vars) => {
      const res = evaluatePct003(vars);
      return `Step 1: Identify that the sugar amount (${vars.sugar}g) is scaled proportionally with servings, so the percentage increase of sugar matches the servings increase.\n` +
             `Step 2: Servings increase = ${vars.newServings} - ${vars.servings} = ${res.diff}\n` +
             `Step 3: Percentage increase = (${res.diff} / ${vars.servings}) × 100 = ${res.answer}%`;
    },
    transferMapping: "When scaling quantities proportionally, the percentage change of any single ingredient (like sugar) is equal to the percentage change of the scale (servings). The formula for percentage change is: (change / original) × 100."
  }
];

const ratioScenarios = [
  {
    scenarioId: 'ratio-transfer-001',
    context: 'travel',
    transferLevel: 2,
    icon: '🚂',
    generate: () => {
      const scales = [1, 2, 5];
      const distances = [10, 50, 100, 150, 200];
      const mapDists = [3, 5, 8, 12, 15];

      const scale = scales[Math.floor(Math.random() * scales.length)];
      const distance = distances[Math.floor(Math.random() * distances.length)];
      const mapDist = mapDists[Math.floor(Math.random() * mapDists.length)];

      const vars = { scale, distance, mapDist };
      const res = evaluateRatio001(vars);

      return {
        scenarioId: 'ratio-transfer-001',
        context: 'travel',
        prompt: `On a map of India, ${scale} cm represents ${distance} km in real life. If two cities are ${mapDist} cm apart on the map, what is the actual distance between them in km?`,
        variables: vars,
        hints: [
          `This is a ratio problem. The scale ratio is map distance : actual distance = ${scale} : ${distance}.`,
          `For 1 cm on the map, the actual distance is ${distance} / ${scale} = ${distance / scale} km.`,
          `Multiply the 1-cm distance by the map distance (${mapDist} cm) to get the answer.`
        ]
      };
    },
    evaluate: (vars) => evaluateRatio001(vars).answer,
    explanation: (vars) => {
      const res = evaluateRatio001(vars);
      return `Step 1: Establish the scale ratio → ${vars.scale} cm : ${vars.distance} km\n` +
             `Step 2: Find the distance represented by 1 cm → ${vars.distance} / ${vars.scale} = ${res.unitDist} km\n` +
             `Step 3: Multiply by the map distance → ${vars.mapDist} cm × ${res.unitDist} km/cm = ${res.answer} km`;
    },
    transferMapping: "A map scale is a ratio of map distance to real-world distance. If a:b represents the scale, and you have map distance c, the real-world distance is c × (b / a)."
  },
  {
    scenarioId: 'ratio-transfer-002',
    context: 'cooking',
    transferLevel: 2,
    icon: '🍕',
    generate: () => {
      const lemonWaterPairs = [
        { juice: 1, water: 4 },
        { juice: 1, water: 5 },
        { juice: 1, water: 6 },
        { juice: 2, water: 5 },
        { juice: 2, water: 7 }
      ];
      const juiceUseds = [50, 100, 150, 200, 250];

      const pair = lemonWaterPairs[Math.floor(Math.random() * lemonWaterPairs.length)];
      const juiceUsed = juiceUseds[Math.floor(Math.random() * juiceUseds.length)];

      const vars = { juice: pair.juice, water: pair.water, juiceUsed };
      const res = evaluateRatio002(vars);

      return {
        scenarioId: 'ratio-transfer-002',
        context: 'cooking',
        prompt: `To make a jug of lemonade, the ratio of lemon juice to water is ${pair.juice}:${pair.water}. If you use ${juiceUsed} ml of lemon juice, how much water in ml should you add to keep the same ratio?`,
        variables: vars,
        hints: [
          `The parts ratio is juice : water = ${pair.juice} : ${pair.water}.`,
          `Calculate how many times larger the juice used (${juiceUsed} ml) is than the ratio part (${pair.juice}).`,
          `Multiply that scaling factor by the water ratio part (${pair.water}) to find the water needed.`
        ]
      };
    },
    evaluate: (vars) => evaluateRatio002(vars).answer,
    explanation: (vars) => {
      const res = evaluateRatio002(vars);
      return `Step 1: Set up the proportion → juice / water = ${vars.juice} / ${vars.water}\n` +
             `Step 2: Find the scaling multiplier → ${vars.juiceUsed} ml / ${vars.juice} = ${res.scale}\n` +
             `Step 3: Calculate water required → ${vars.water} parts × ${res.scale} ml/part = ${res.answer} ml`;
    },
    transferMapping: "Ratios define proportional relationships. If the ratio is a:b, then juice/water = a/b. When juice becomes J, water becomes J × (b / a) to preserve the ratio."
  },
  {
    scenarioId: 'ratio-transfer-003',
    context: 'shopping',
    transferLevel: 3,
    icon: '🛒',
    generate: () => {
      const totals = [500, 600, 800, 1000, 1200, 1500];
      const ratios = [
        { r1: 2, r2: 3 }, // sum 5
        { r1: 1, r2: 4 }, // sum 5
        { r1: 3, r2: 5 }, // sum 8
        { r1: 1, r2: 5 }  // sum 6
      ];

      // Pick a total and find a ratio that divides it perfectly
      let total, r1, r2;
      for (let attempt = 0; attempt < 50; attempt++) {
        total = totals[Math.floor(Math.random() * totals.length)];
        const pair = ratios[Math.floor(Math.random() * ratios.length)];
        if (total % (pair.r1 + pair.r2) === 0) {
          r1 = pair.r1;
          r2 = pair.r2;
          break;
        }
      }
      if (!r1) { total = 1000; r1 = 2; r2 = 3; } // Fallback

      const vars = { total, r1, r2 };
      const res = evaluateRatio003(vars);

      return {
        scenarioId: 'ratio-transfer-003',
        context: 'shopping',
        prompt: `Ravi and Priya divide their pocket money of ₹${total} in the ratio ${r1}:${r2}. How much more money does Priya get than Ravi, given that Priya gets the larger share?`,
        variables: vars,
        hints: [
          `First find the value of one part in the ratio. The total ratio parts sum up to ${r1} + ${r2} = ${r1 + r2} parts.`,
          `One ratio part is worth ₹${total} / ${r1 + r2} = ₹${total / (r1 + r2)}.`,
          `Calculate the difference in parts between Priya and Ravi (${r2} - ${r1} = ${r2 - r1} parts), and multiply it by the value of one part.`
        ]
      };
    },
    evaluate: (vars) => evaluateRatio003(vars).answer,
    explanation: (vars) => {
      const res = evaluateRatio003(vars);
      return `Step 1: Find total ratio parts → ${vars.r1} + ${vars.r2} = ${res.partsSum}\n` +
             `Step 2: Find the value of 1 ratio part → ₹${vars.total} / ${res.partsSum} = ₹${res.unitValue}\n` +
             `Step 3: Find Ravi's share → ${vars.r1} parts × ₹${res.unitValue} = ₹${res.share1}\n` +
             `Step 4: Find Priya's share → ${vars.r2} parts × ₹${res.unitValue} = ₹${res.share2}\n` +
             `Step 5: Find the difference → ₹${res.share2} - ₹${res.share1} = ₹${res.answer}`;
    },
    transferMapping: "To divide an amount in ratio a:b, calculate the sum of parts (a + b). Each part is worth Total / (a + b). The difference between the shares is (b - a) × part value."
  }
];

const fractionaddScenarios = [
  {
    scenarioId: 'frac-transfer-001',
    context: 'pocketmoney',
    transferLevel: 2,
    icon: '🛒',
    generate: () => {
      const options = [
        { f1n: 1, f1d: 3, f2n: 1, f2d: 4 }, // sum 7/12, rem 5/12
        { f1n: 1, f1d: 4, f2n: 1, f2d: 5 }, // sum 9/20, rem 11/20
        { f1n: 1, f1d: 3, f2n: 2, f2d: 5 }, // sum 11/15, rem 4/15
        { f1n: 1, f1d: 4, f2n: 1, f2d: 3 }, // sum 7/12, rem 5/12
        { f1n: 1, f1d: 2, f2n: 1, f2d: 5 }  // sum 7/10, rem 3/10
      ];
      const opt = options[Math.floor(Math.random() * options.length)];
      const vars = { f1n: opt.f1n, f1d: opt.f1d, f2n: opt.f2n, f2d: opt.f2d };
      const res = evaluateFrac001(vars);

      return {
        scenarioId: 'frac-transfer-001',
        context: 'pocketmoney',
        prompt: `Arjun spends ${opt.f1n}/${opt.f1d} of his pocket money on books and ${opt.f2n}/${opt.f2d} on snacks. What fraction of his pocket money does he have left?`,
        variables: vars,
        hints: [
          `First add the two fractions together to find the total fraction spent: ${opt.f1n}/${opt.f1d} + ${opt.f2n}/${opt.f2d}.`,
          `Find a common denominator to add the fractions. For example, the common denominator for ${opt.f1d} and ${opt.f2d} is ${res.lcm}.`,
          `Subtract the sum of the spent fractions from the whole pocket money (which is represented by 1).`
        ]
      };
    },
    evaluate: (vars) => evaluateFrac001(vars).answer,
    explanation: (vars) => {
      const res = evaluateFrac001(vars);
      return `Step 1: Find the fraction spent in total → ${vars.f1n}/${vars.f1d} + ${vars.f2n}/${vars.f2d}\n` +
             `        = ${res.spentNum}/${res.lcm}\n` +
             `Step 2: Subtract from the whole (1) → 1 - ${res.spentNum}/${res.lcm} = ${res.lcm}/${res.lcm} - ${res.spentNum}/${res.lcm} = ${res.answer}`;
    },
    transferMapping: "Fraction addition allows you to find a combined share of a whole. Subtracting a fraction from 1 represents finding the remaining fraction of a whole resource."
  },
  {
    scenarioId: 'frac-transfer-002',
    context: 'cooking',
    transferLevel: 2,
    icon: '🍕',
    generate: () => {
      const options = [
        { f1n: 1, f1d: 4, f2n: 1, f2d: 3 }, // sum 7/12
        { f1n: 1, f1d: 4, f2n: 2, f2d: 5 }, // sum 13/20
        { f1n: 1, f1d: 3, f2n: 2, f2d: 5 }, // sum 11/15
        { f1n: 2, f1d: 5, f2n: 1, f2d: 3 }, // sum 11/15
        { f1n: 1, f1d: 6, f2n: 1, f2d: 4 }  // sum 5/12
      ];
      const opt = options[Math.floor(Math.random() * options.length)];
      const vars = { f1n: opt.f1n, f1d: opt.f1d, f2n: opt.f2n, f2d: opt.f2d };
      const res = evaluateFrac002(vars);

      return {
        scenarioId: 'frac-transfer-002',
        context: 'cooking',
        prompt: `Meena ate ${opt.f1n}/${opt.f1d} of a pizza, and Rahul ate ${opt.f2n}/${opt.f2d} of the same pizza. What fraction of the pizza was eaten in total?`,
        variables: vars,
        hints: [
          `To find the total fraction of pizza eaten, add the two fractions: ${opt.f1n}/${opt.f1d} + ${opt.f2n}/${opt.f2d}.`,
          `Find a common denominator (LCM of ${opt.f1d} and ${opt.f2d} is ${res.lcm}).`,
          `Convert both fractions to have this common denominator, then add the numerators.`
        ]
      };
    },
    evaluate: (vars) => evaluateFrac002(vars).answer,
    explanation: (vars) => {
      const res = evaluateFrac002(vars);
      return `Step 1: Add Meena and Rahul's fractions → ${vars.f1n}/${vars.f1d} + ${vars.f2n}/${vars.f2d}\n` +
             `Step 2: Find common denominator → LCM of ${vars.f1d} and ${vars.f2d} is ${res.lcm}\n` +
             `Step 3: Convert and sum → ${res.v1n}/${res.lcm} + ${res.v2n}/${res.lcm} = ${res.answer}`;
    },
    transferMapping: "Adding fractions finds the combined total when sharing a resource. Always convert the fractions to a common denominator before adding."
  }
];

// Helper evaluation functions to ensure correct values and steps are computed
function evaluatePct001(vars) {
  const discountAmt = Math.round(vars.price * (vars.discount / 100) * 100) / 100;
  const discounted = vars.price - discountAmt;
  const discountedDisplay = Math.round(discounted * 100) / 100;
  const gstAmt = Math.round(discounted * (vars.gst / 100) * 100) / 100;
  const final = discounted + gstAmt;
  const answer = Math.round(final * 100) / 100;

  return { discountAmt, discountedDisplay, gstAmt, answer };
}

function evaluatePct002(vars) {
  const runs = vars.overs * vars.rate;
  const answer = Math.round(((runs / vars.target) * 100) * 100) / 100;
  return { runs, answer };
}

function evaluatePct003(vars) {
  const diff = vars.newServings - vars.servings;
  const answer = Math.round(((diff / vars.servings) * 100) * 100) / 100;
  return { diff, answer };
}

function evaluateRatio001(vars) {
  const unitDist = vars.distance / vars.scale;
  const answer = Math.round((vars.mapDist * unitDist) * 100) / 100;
  return { unitDist, answer };
}

function evaluateRatio002(vars) {
  const scale = vars.juiceUsed / vars.juice;
  const answer = Math.round((vars.water * scale) * 100) / 100;
  return { scale, answer };
}

function evaluateRatio003(vars) {
  const partsSum = vars.r1 + vars.r2;
  const unitValue = vars.total / partsSum;
  const share1 = vars.r1 * unitValue;
  const share2 = vars.r2 * unitValue;
  const answer = share2 - share1;
  return { partsSum, unitValue, share1, share2, answer };
}

function evaluateFrac001(vars) {
  const lcm = (vars.f1d * vars.f2d) / gcd(vars.f1d, vars.f2d);
  const spentNum = vars.f1n * (lcm / vars.f1d) + vars.f2n * (lcm / vars.f2d);
  const answerNum = lcm - spentNum;
  const answer = simplifyFraction(answerNum, lcm);
  return { lcm, spentNum, answerNum, answer };
}

function evaluateFrac002(vars) {
  const lcm = (vars.f1d * vars.f2d) / gcd(vars.f1d, vars.f2d);
  const v1n = vars.f1n * (lcm / vars.f1d);
  const v2n = vars.f2n * (lcm / vars.f2d);
  const answerNum = v1n + v2n;
  const answer = simplifyFraction(answerNum, lcm);
  return { lcm, v1n, v2n, answerNum, answer };
}

const additionScenarios = [
  {
    scenarioId: 'add-transfer-001',
    context: 'travel',
    transferLevel: 2,
    icon: '🚂',
    generate: () => {
      const initial = [120, 150, 180, 200, 220, 250][Math.floor(Math.random() * 6)];
      const off = [15, 20, 25, 30, 35][Math.floor(Math.random() * 5)];
      const on = [25, 30, 35, 40, 45, 50][Math.floor(Math.random() * 6)];
      const vars = { initial, off, on };
      return {
        scenarioId: 'add-transfer-001',
        context: 'travel',
        prompt: `A passenger train leaves Chennai Central with ${initial} passengers. At the first station, ${off} passengers get off the train, and ${on} new passengers get on. How many passengers are on the train when it departs the station?`,
        variables: vars,
        hints: [
          `Find out how many passengers were left on the train when ${off} passengers got off first.`,
          `Subtract ${off} from the initial count of ${initial} passengers (which is ${initial - off}).`,
          `Now add the ${on} new passengers who got on the train.`
        ]
      };
    },
    evaluate: (vars) => vars.initial - vars.off + vars.on,
    explanation: (vars) => {
      const remaining = vars.initial - vars.off;
      const ans = remaining + vars.on;
      return `Step 1: Subtract passengers who got off → ${vars.initial} - ${vars.off} = ${remaining}\n` +
             `Step 2: Add passengers who got on → ${remaining} + ${vars.on} = ${ans}`;
    },
    transferMapping: "Adding and subtracting whole numbers maps directly to real-world volume changes, such as passengers on a train."
  },
  {
    scenarioId: 'add-transfer-002',
    context: 'shopping',
    transferLevel: 2,
    icon: '🛒',
    generate: () => {
      const budget = [1000, 1500, 2000, 2500][Math.floor(Math.random() * 4)];
      const s1 = [350, 450, 550][Math.floor(Math.random() * 3)];
      const s2 = [200, 300, 400][Math.floor(Math.random() * 3)];
      const refund = [50, 80, 100][Math.floor(Math.random() * 3)];
      const vars = { budget, s1, s2, refund };
      return {
        scenarioId: 'add-transfer-002',
        context: 'shopping',
        prompt: `Karan goes shopping with ₹${budget}. He buys a shirt for ₹${s1} and a belt for ₹${s2}. Later, he returns a small item and receives a cash refund of ₹${refund}. How much money does Karan have left now?`,
        variables: vars,
        hints: [
          `Calculate the total amount spent on the shirt and the belt first.`,
          `Subtract that total spent amount from his initial budget of ₹${budget}.`,
          `Add the refund of ₹${refund} to find his final remaining balance.`
        ]
      };
    },
    evaluate: (vars) => vars.budget - (vars.s1 + vars.s2) + vars.refund,
    explanation: (vars) => {
      const spent = vars.s1 + vars.s2;
      const left = vars.budget - spent;
      const ans = left + vars.refund;
      return `Step 1: Find total amount spent → ₹${vars.s1} + ₹${vars.s2} = ₹${spent}\n` +
             `Step 2: Subtract from budget → ₹${vars.budget} - ₹${spent} = ₹${left}\n` +
             `Step 3: Add the refund → ₹${left} + ₹${vars.refund} = ₹${ans}`;
    },
    transferMapping: "A budget decreases by the sum of expenses and increases when a cash refund is returned."
  }
];

const decimalsScenarios = [
  {
    scenarioId: 'dec-transfer-001',
    context: 'sports',
    transferLevel: 2,
    icon: '🏏',
    generate: () => {
      const t1 = [9.58, 9.63, 9.69, 9.72, 9.81][Math.floor(Math.random() * 5)];
      const gap = [0.12, 0.15, 0.18, 0.22, 0.25][Math.floor(Math.random() * 5)];
      const vars = { t1, gap };
      return {
        scenarioId: 'dec-transfer-001',
        context: 'sports',
        prompt: `In a 100-meter sprint, the winner completes the race in ${t1} seconds. The runner-up finishes trailing the winner by ${gap} seconds. What is the runner-up's race completion time in seconds?`,
        variables: vars,
        hints: [
          `Trailing the winner means taking longer to finish, so the runner-up's time must be greater than the winner's time.`,
          `Line up the decimal points of ${t1} and ${gap} before adding.`,
          `Calculate ${t1} + ${gap} to find the final time.`
        ]
      };
    },
    evaluate: (vars) => Math.round((vars.t1 + vars.gap) * 100) / 100,
    explanation: (vars) => {
      const ans = Math.round((vars.t1 + vars.gap) * 100) / 100;
      return `Step 1: Set up the decimal sum → ${vars.t1} + ${vars.gap}\n` +
             `Step 2: Align decimal places and add → ${ans} seconds`;
    },
    transferMapping: "Adding a trailing delay gap in time results in a larger decimal finish time value."
  },
  {
    scenarioId: 'dec-transfer-002',
    context: 'cooking',
    transferLevel: 2,
    icon: '🍕',
    generate: () => {
      const target = [1.5, 1.8, 2.0, 2.5][Math.floor(Math.random() * 4)];
      const c1 = [0.45, 0.65, 0.75, 0.85][Math.floor(Math.random() * 4)];
      const c2 = [0.35, 0.40, 0.55, 0.60][Math.floor(Math.random() * 4)];
      const vars = { target, c1, c2 };
      return {
        scenarioId: 'dec-transfer-002',
        context: 'cooking',
        prompt: `A baker needs a total of ${target} kg of flour mix. They weigh out ${c1} kg of wheat flour and ${c2} kg of ragi flour. How many more kg of flour must they add to reach the target weight?`,
        variables: vars,
        hints: [
          `Find the combined weight of wheat and ragi flour by adding ${c1} and ${c2} first.`,
          `The sum of the weighed flours is ${Math.round((c1 + c2) * 100) / 100} kg.`,
          `Subtract this sum from the target weight of ${target} kg.`
        ]
      };
    },
    evaluate: (vars) => Math.round((vars.target - (vars.c1 + vars.c2)) * 100) / 100,
    explanation: (vars) => {
      const sum = Math.round((vars.c1 + vars.c2) * 100) / 100;
      const ans = Math.round((vars.target - sum) * 100) / 100;
      return `Step 1: Find total weighed flour → ${vars.c1} kg + ${vars.c2} kg = ${sum} kg\n` +
             `Step 2: Subtract from target weight → ${vars.target} kg - ${sum} kg = ${ans} kg`;
    },
    transferMapping: "Finding a remaining decimal fraction is solved by subtracting the sum of known decimal parts from the target whole."
  }
];

const hcflcmScenarios = [
  {
    scenarioId: 'hcflcm-transfer-001',
    context: 'pocketmoney',
    transferLevel: 2,
    icon: '🛒',
    generate: () => {
      const a = [24, 36, 48, 60][Math.floor(Math.random() * 4)];
      const b = [30, 45, 60, 75][Math.floor(Math.random() * 4)];
      const vars = { a, b };
      return {
        scenarioId: 'hcflcm-transfer-001',
        context: 'pocketmoney',
        prompt: `Meena has ${a} chocolates and ${b} juice boxes. She wants to divide them into identical gift bags for her friends with none left over. What is the maximum number of bags she can prepare?`,
        variables: vars,
        hints: [
          `To divide both items equally without any remainders, the number of bags must divide both ${a} and ${b}.`,
          `To find the maximum possible number of bags, you must find the Highest Common Factor (HCF) of ${a} and ${b}.`,
          `Find the largest integer that divides both ${a} and ${b} perfectly.`
        ]
      };
    },
    evaluate: (vars) => gcd(vars.a, vars.b),
    explanation: (vars) => {
      const ans = gcd(vars.a, vars.b);
      return `Step 1: Identify HCF is needed to share resources equally with maximum bags.\n` +
             `Step 2: Find HCF of ${vars.a} and ${vars.b} → ${ans}`;
    },
    transferMapping: "The maximum identical packages that can be split without remainders is equivalent to the Greatest Common Divisor (GCD/HCF)."
  },
  {
    scenarioId: 'hcflcm-transfer-002',
    context: 'sports',
    transferLevel: 2,
    icon: '🏏',
    generate: () => {
      const l1 = [45, 60, 75][Math.floor(Math.random() * 3)];
      const l2 = [30, 40, 50][Math.floor(Math.random() * 3)];
      const vars = { l1, l2 };
      return {
        scenarioId: 'hcflcm-transfer-002',
        context: 'sports',
        prompt: `Two runners, Arjun and Priya, start running laps around a circular track at the same time from the starting line. Arjun completes a lap every ${l1} seconds, and Priya completes a lap every ${l2} seconds. After how many seconds will they meet at the starting line again for the first time?`,
        variables: vars,
        hints: [
          `They will meet again at a time that is a common multiple of both runners' lap times.`,
          `To find the first time they meet, calculate the Least Common Multiple (LCM) of ${l1} and ${l2} seconds.`,
          `Find the smallest number that is a multiple of both ${l1} and ${l2}.`
        ]
      };
    },
    evaluate: (vars) => (vars.l1 * vars.l2) / gcd(vars.l1, vars.l2),
    explanation: (vars) => {
      const ans = (vars.l1 * vars.l2) / gcd(vars.l1, vars.l2);
      return `Step 1: Identify that synchronization cycles match multiples.\n` +
             `Step 2: Find the LCM of ${vars.l1} and ${vars.l2} → ${ans} seconds`;
    },
    transferMapping: "Recurring synchronized intervals are determined by evaluating the Least Common Multiple (LCM)."
  }
];

const lineareqScenarios = [
  {
    scenarioId: 'lineq-transfer-001',
    context: 'shopping',
    transferLevel: 2,
    icon: '🛒',
    generate: () => {
      const f = [40, 50, 60][Math.floor(Math.random() * 3)];
      const c = [15, 20, 25, 30][Math.floor(Math.random() * 4)];
      const n = [5, 6, 8, 10, 12][Math.floor(Math.random() * 5)];
      const total = f + c * n;
      const vars = { f, c, total };
      return {
        scenarioId: 'lineq-transfer-001',
        context: 'shopping',
        prompt: `An online bookstore charges a flat shipping fee of ₹${f} per order plus ₹${c} for every notebook purchased. If Ananya's total bill is ₹${total}, how many notebooks did she order?`,
        variables: vars,
        hints: [
          `Express the scenario as an equation: ${f} + ${c} × (number of notebooks) = ${total}.`,
          `Subtract the flat shipping fee ₹${f} from the total bill ₹${total} to find the cost of only notebooks.`,
          `Divide that value (${total - f}) by the cost of one notebook (₹${c}) to find the quantity.`
        ]
      };
    },
    evaluate: (vars) => (vars.total - vars.f) / vars.c,
    explanation: (vars) => {
      const net = vars.total - vars.f;
      const ans = net / vars.c;
      return `Step 1: Set up shipping cost equation → ${vars.f} + ${vars.c}x = ${vars.total}\n` +
             `Step 2: Subtract shipping cost → ${vars.c}x = ${net}\n` +
             `Step 3: Solve for x → x = ${net} / ${vars.c} = ${ans} notebooks`;
    },
    transferMapping: "Solving for variable item counts from mixed fixed/variable pricing maps directly to single-variable linear equations."
  },
  {
    scenarioId: 'lineq-transfer-002',
    context: 'travel',
    transferLevel: 2,
    icon: '🚂',
    generate: () => {
      const base = [50, 70, 100][Math.floor(Math.random() * 3)];
      const rate = [12, 15, 18, 20][Math.floor(Math.random() * 4)];
      const dist = [5, 8, 10, 12, 15][Math.floor(Math.random() * 5)];
      const total = base + rate * dist;
      const vars = { base, rate, total };
      return {
        scenarioId: 'lineq-transfer-002',
        context: 'travel',
        prompt: `A taxi ride charges a base fare of ₹${base} plus ₹${rate} per kilometer. If Priya's total taxi fare is ₹${total}, what was the distance of her journey in kilometers?`,
        variables: vars,
        hints: [
          `Formulate the equation: ${base} + ${rate} × (distance) = ${total}.`,
          `Subtract the fixed base fare of ₹${base} from the total fare.`,
          `Divide the remaining fare by the kilometer rate of ₹${rate}.`
        ]
      };
    },
    evaluate: (vars) => (vars.total - vars.base) / vars.rate,
    explanation: (vars) => {
      const net = vars.total - vars.base;
      const ans = net / vars.rate;
      return `Step 1: Set up taxi fare equation → ${vars.base} + ${vars.rate}d = ${vars.total}\n` +
             `Step 2: Subtract base fare → ${vars.rate}d = ${net}\n` +
             `Step 3: Solve for d → d = ${net} / ${vars.rate} = ${ans} km`;
    },
    transferMapping: "Variable distance fares with fixed hire elements require isolating variables in a linear relationship."
  }
];

const sdtScenarios = [
  {
    scenarioId: 'sdt-transfer-001',
    context: 'travel',
    transferLevel: 3,
    icon: '🚂',
    generate: () => {
      const s1 = [60, 80][Math.floor(Math.random() * 2)];
      const s2 = [100, 120][Math.floor(Math.random() * 2)];
      const delay = [1, 2][Math.floor(Math.random() * 2)];
      const vars = { s1, s2, delay };
      return {
        scenarioId: 'sdt-transfer-001',
        context: 'travel',
        prompt: `A freight train leaves Chennai Central traveling at ${s1} km/h. ${delay} hours later, an express passenger train leaves the same station in the same direction on a parallel track, traveling at ${s2} km/h. How many hours will it take the express train to catch up?`,
        variables: vars,
        hints: [
          `Find how far the freight train traveled before the express train started. That distance is Speed × Time = ${s1} × ${delay} km.`,
          `The express train catches up at a relative speed of ${s2} - ${s1} = ${s2 - s1} km/h.`,
          `Divide the lead distance by the relative speed to find the catch-up time.`
        ]
      };
    },
    evaluate: (vars) => Math.round(((vars.s1 * vars.delay) / (vars.s2 - vars.s1)) * 100) / 100,
    explanation: (vars) => {
      const lead = vars.s1 * vars.delay;
      const relSpeed = vars.s2 - vars.s1;
      const ans = Math.round((lead / relSpeed) * 100) / 100;
      return `Step 1: Calculate lead distance → ${vars.s1} km/h × ${vars.delay} hours = ${lead} km\n` +
             `Step 2: Calculate relative speed difference → ${vars.s2} - ${vars.s1} = ${relSpeed} km/h\n` +
             `Step 3: Calculate catch-up time → ${lead} km / ${relSpeed} km/h = ${ans} hours`;
    },
    transferMapping: "The time to close a spatial gap is equal to the initial lead distance divided by the relative speed difference of the objects."
  },
  {
    scenarioId: 'sdt-transfer-002',
    context: 'travel',
    transferLevel: 3,
    icon: '🚂',
    generate: () => {
      const s1 = [40, 60, 80][Math.floor(Math.random() * 3)];
      const s2 = [60, 80, 120][Math.floor(Math.random() * 3)];
      const vars = { s1, s2 };
      return {
        scenarioId: 'sdt-transfer-002',
        context: 'travel',
        prompt: `A car travels from City A to City B at an average speed of ${s1} km/h, and returns along the same route at ${s2} km/h. What is the average speed for the entire round trip in km/h?`,
        variables: vars,
        hints: [
          `The average speed is NOT the simple average of ${s1} and ${s2}!`,
          `Let the distance between cities be D. Total distance is 2D. Total time is (D / ${s1}) + (D / ${s2}).`,
          `Use the harmonic mean formula for equal distances: Average Speed = 2 × S1 × S2 / (S1 + S2).`
        ]
      };
    },
    evaluate: (vars) => Math.round(((2 * vars.s1 * vars.s2) / (vars.s1 + vars.s2)) * 100) / 100,
    explanation: (vars) => {
      const num = 2 * vars.s1 * vars.s2;
      const den = vars.s1 + vars.s2;
      const ans = Math.round((num / den) * 100) / 100;
      return `Step 1: Set up the harmonic mean formula → 2 × S1 × S2 / (S1 + S2)\n` +
             `Step 2: Multiply speeds → 2 × ${vars.s1} × ${vars.s2} = ${num}\n` +
             `Step 3: Divide by sum of speeds → ${num} / (${vars.s1} + ${vars.s2}) = ${ans} km/h`;
    },
    transferMapping: "The average speed over equal segments of a round trip is calculated using the harmonic mean, not the arithmetic mean."
  }
];

const probScenarios = [
  {
    scenarioId: 'prob-transfer-001',
    context: 'sports',
    transferLevel: 2,
    icon: '🏏',
    generate: () => {
      const w = [12, 15, 18, 20][Math.floor(Math.random() * 4)];
      const d = [3, 4, 5][Math.floor(Math.random() * 3)];
      const l = [5, 6, 7][Math.floor(Math.random() * 3)];
      const vars = { w, d, l };
      return {
        scenarioId: 'prob-transfer-001',
        context: 'sports',
        prompt: `In a school cricket league, a team won ${w} matches, drew ${d} matches, and lost ${l} matches. If one match is chosen at random, what is the probability (as a simplified fraction) that the team did not lose?`,
        variables: vars,
        hints: [
          `Find the total matches played by adding wins, draws, and losses.`,
          `Calculate the number of games they 'did not lose' (wins + draws = ${w + d}).`,
          `Write as a fraction: (favorable outcomes) / (total outcomes) and simplify.`
        ]
      };
    },
    evaluate: (vars) => {
      const total = vars.w + vars.d + vars.l;
      const favorable = vars.w + vars.d;
      return simplifyFraction(favorable, total);
    },
    explanation: (vars) => {
      const total = vars.w + vars.d + vars.l;
      const favorable = vars.w + vars.d;
      const ans = simplifyFraction(favorable, total);
      return `Step 1: Find total matches → ${vars.w} + ${vars.d} + ${vars.l} = ${total}\n` +
             `Step 2: Find matches not lost → ${vars.w} + ${vars.d} = ${favorable}\n` +
             `Step 3: Write and simplify fraction → ${favorable}/${total} = ${ans}`;
    },
    transferMapping: "Probability of an event is the ratio of favorable outcomes to the total outcomes in the sample space."
  },
  {
    scenarioId: 'prob-transfer-002',
    context: 'pocketmoney',
    transferLevel: 2,
    icon: '🛒',
    generate: () => {
      const r = [5, 6, 8][Math.floor(Math.random() * 3)];
      const b = [4, 5, 6][Math.floor(Math.random() * 3)];
      const g = [3, 4, 5][Math.floor(Math.random() * 3)];
      const vars = { r, b, g };
      return {
        scenarioId: 'prob-transfer-002',
        context: 'pocketmoney',
        prompt: `A jar contains ${r} red marbles, ${b} blue marbles, and ${g} green marbles. If you pull out one marble at random, what is the probability (as a simplified fraction) of drawing a red marble?`,
        variables: vars,
        hints: [
          `Find the total number of marbles in the jar by adding the marbles: ${r} + ${b} + ${g}.`,
          `The number of red marbles is ${r}.`,
          `Form a fraction of red marbles over the total count and reduce it to simplest form.`
        ]
      };
    },
    evaluate: (vars) => {
      const total = vars.r + vars.b + vars.g;
      return simplifyFraction(vars.r, total);
    },
    explanation: (vars) => {
      const total = vars.r + vars.b + vars.g;
      const ans = simplifyFraction(vars.r, total);
      return `Step 1: Find total marbles → ${vars.r} + ${vars.b} + ${vars.g} = ${total}\n` +
             `Step 2: Favorable red outcomes → ${vars.r}\n` +
             `Step 3: Write and simplify fraction → ${vars.r}/${total} = ${ans}`;
    },
    transferMapping: "Calculating target color ratios represents fractional probability of picking a single item from a colored set."
  }
];

const mensurScenarios = [
  {
    scenarioId: 'mens-transfer-001',
    context: 'cooking',
    transferLevel: 2,
    icon: '🍕',
    generate: () => {
      const l = [20, 25, 30][Math.floor(Math.random() * 3)];
      const w = [15, 20, 25][Math.floor(Math.random() * 3)];
      const h = [5, 6, 8][Math.floor(Math.random() * 3)];
      const vars = { l, w, h };
      return {
        scenarioId: 'mens-transfer-001',
        context: 'cooking',
        prompt: `A rectangular baking tin has a length of ${l} cm, a width of ${w} cm, and a depth of ${h} cm. If a chef lines the inner bottom and the four vertical sides with baking paper, what is the total area of paper needed in cm²?`,
        variables: vars,
        hints: [
          `The baking tin has a base and 4 vertical walls, but no top cover (open box).`,
          `The bottom area is L × W = ${l} × ${w} = ${l * w} cm².`,
          `The 4 walls have a combined area of 2 × H × (L + W) = 2 × ${h} × (${l} + ${w}) cm².`
        ]
      };
    },
    evaluate: (vars) => vars.l * vars.w + 2 * vars.h * (vars.l + vars.w),
    explanation: (vars) => {
      const base = vars.l * vars.w;
      const walls = 2 * vars.h * (vars.l + vars.w);
      const ans = base + walls;
      return `Step 1: Find base area → ${vars.l} × ${vars.w} = ${base} cm²\n` +
             `Step 2: Find side wall areas → 2 × ${vars.h} × (${vars.l} + ${vars.w}) = ${walls} cm²\n` +
             `Step 3: Combine areas → ${base} + ${walls} = ${ans} cm²`;
    },
    transferMapping: "The surface area of an open rectangular prism is evaluated by omitting the top face: base + 2 × height × (length + width)."
  },
  {
    scenarioId: 'mens-transfer-002',
    context: 'travel',
    transferLevel: 2,
    icon: '🚂',
    generate: () => {
      const r = [7, 14, 21][Math.floor(Math.random() * 3)];
      const h = [10, 15, 20][Math.floor(Math.random() * 3)];
      const vars = { r, h };
      return {
        scenarioId: 'mens-transfer-002',
        context: 'travel',
        prompt: `A cylindrical water tanker train coach has a base radius of ${r} meters and a height (length) of ${h} meters. What is the total volume of water in cubic meters (m³) it can hold? (Use π = 22/7)`,
        variables: vars,
        hints: [
          `A cylinder's volume is given by the formula: Volume = π × r² × h.`,
          `Substitute r = ${r}, h = ${h}, and π = 22/7.`,
          `Calculate (22/7) × ${r} × ${r} × ${h} to find the volume.`
        ]
      };
    },
    evaluate: (vars) => Math.round((22 / 7) * vars.r * vars.r * vars.h),
    explanation: (vars) => {
      const ans = Math.round((22 / 7) * vars.r * vars.r * vars.h);
      return `Step 1: Set up cylinder volume formula → V = πr²h\n` +
             `Step 2: Substitute values → (22/7) × ${vars.r} × ${vars.r} × ${vars.h}\n` +
             `Step 3: Compute volume → ${ans} cubic meters`;
    },
    transferMapping: "Calculating liquid holding capacity of standard tankers maps directly to evaluating cylinder volumes."
  }
];

const quadraticScenarios = [
  {
    scenarioId: 'quad-transfer-001',
    context: 'cooking',
    transferLevel: 3,
    icon: '🍕',
    generate: () => {
      const diff = [2, 4][Math.floor(Math.random() * 2)];
      const x = [6, 8, 10][Math.floor(Math.random() * 3)];
      const total = x * (x + diff);
      const vars = { diff, total };
      return {
        scenarioId: 'quad-transfer-001',
        context: 'cooking',
        prompt: `A chef lays out cookie dough circles on a rectangular tray. The number of rows is ${diff} more than the number of columns. If the tray fits exactly ${total} cookies in total, how many rows are there?`,
        variables: vars,
        hints: [
          `Let the number of columns be x. The number of rows is x + ${diff}.`,
          `The total cookies is rows × columns: x(x + ${diff}) = ${total}.`,
          `This expands to the quadratic equation: x² + ${diff}x - ${total} = 0. Solve for positive x.`
        ]
      };
    },
    evaluate: (vars) => {
      const a = 1, b = vars.diff, c = -vars.total;
      const x = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
      return x + vars.diff;
    },
    explanation: (vars) => {
      const a = 1, b = vars.diff, c = -vars.total;
      const x = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
      const rows = x + vars.diff;
      return `Step 1: Model layout as quadratic equation → x(x + ${vars.diff}) = ${vars.total}\n` +
             `Step 2: Expand to standard form → x² + ${vars.diff}x - ${vars.total} = 0\n` +
             `Step 3: Factor or solve roots → (x - ${x})(x + ${x + vars.diff}) = 0 → x = ${x} (columns)\n` +
             `Step 4: Find rows → columns + ${vars.diff} = ${rows} rows`;
    },
    transferMapping: "Grid-based surface constraints require forming and resolving quadratic formulas."
  },
  {
    scenarioId: 'quad-transfer-002',
    context: 'sports',
    transferLevel: 3,
    icon: '🏏',
    generate: () => {
      const v = [30, 40, 50][Math.floor(Math.random() * 3)];
      const vars = { v };
      return {
        scenarioId: 'quad-transfer-002',
        context: 'sports',
        prompt: `A cricket ball is hit straight up into the air. Its height in meters after t seconds is modeled by the equation: h = ${v}t - 5t². How many seconds does it take for the ball to land back on the ground?`,
        variables: vars,
        hints: [
          `The ball lands back on the ground when its height is 0, so set h = 0.`,
          `This gives the equation: ${v}t - 5t² = 0. Factor out t.`,
          `The factored form is: t(${v} - 5t) = 0. Find the non-zero value of t.`
        ]
      };
    },
    evaluate: (vars) => vars.v / 5,
    explanation: (vars) => {
      const ans = vars.v / 5;
      return `Step 1: Set height h to 0 → ${vars.v}t - 5t² = 0\n` +
             `Step 2: Factor out the variable t → t(${vars.v} - 5t) = 0\n` +
             `Step 3: Solve for non-zero time → 5t = ${vars.v} → t = ${ans} seconds`;
    },
    transferMapping: "Evaluating projectile flight durations maps to solving the roots of a quadratic equation when the vertical coordinate equals zero."
  }
];

const matrixScenarios = [
  {
    scenarioId: 'mat-transfer-001',
    context: 'shopping',
    transferLevel: 2,
    icon: '🛒',
    generate: () => {
      const pa = [250, 300][Math.floor(Math.random() * 2)];
      const pc = [150, 200][Math.floor(Math.random() * 2)];
      const ta = [80, 100][Math.floor(Math.random() * 2)];
      const tc = [120, 150][Math.floor(Math.random() * 2)];
      const vars = { pa, pc, ta, tc };
      return {
        scenarioId: 'mat-transfer-001',
        context: 'shopping',
        prompt: `A movie theater charges ₹${pa} for an adult ticket and ₹${pc} for a child ticket. On Friday, they sell ${ta} adult tickets and ${tc} child tickets. Write this as a matrix multiplication of a Row matrix and a Column matrix, and find the total ticket revenue in rupees.`,
        variables: vars,
        hints: [
          `Write prices as a row vector [${pa}, ${pc}] and tickets sold as a column vector [${ta}, ${tc}]^T.`,
          `Multiply prices by quantities element-by-element: (${pa} × ${ta}) + (${pc} × ${tc}).`,
          `Calculate the sum to get the total ticket revenue.`
        ]
      };
    },
    evaluate: (vars) => vars.pa * vars.ta + vars.pc * vars.tc,
    explanation: (vars) => {
      const rev = vars.pa * vars.ta + vars.pc * vars.tc;
      return `Step 1: Form Row and Column matrices → [${vars.pa}, ${vars.pc}] × [${vars.ta}, ${vars.tc}]ᵀ\n` +
             `Step 2: Multiply corresponding entries → (${vars.pa} × ${vars.ta}) + (${vars.pc} × ${vars.tc})\n` +
             `Step 3: Sum up to get total revenue → ₹${rev}`;
    },
    transferMapping: "Multi-product business sales and costing operations are modeled mathematically as vector dot products or Row-by-Column matrix multiplications."
  },
  {
    scenarioId: 'mat-transfer-002',
    context: 'sports',
    transferLevel: 2,
    icon: '🏏',
    generate: () => {
      const a1 = [10, 15][Math.floor(Math.random() * 2)];
      const a2 = [8, 12][Math.floor(Math.random() * 2)];
      const b1 = [5, 10][Math.floor(Math.random() * 2)];
      const b2 = [12, 14][Math.floor(Math.random() * 2)];
      const vars = { a1, a2, b1, b2 };
      return {
        scenarioId: 'mat-transfer-002',
        context: 'sports',
        prompt: `A sports shop has two branches. Branch A has ${a1} cricket bats and ${a2} footballs. Branch B has ${b1} cricket bats and ${b2} footballs. Represent the inventory of each branch as a 1x2 row matrix, and calculate the combined total inventory matrix for both branches.`,
        variables: vars,
        hints: [
          `Branch A matrix is [${a1}, ${a2}]. Branch B matrix is [${b1}, ${b2}].`,
          `To find the combined total inventory matrix, add the corresponding matrix entries.`,
          `The combined inventory is [(${a1} + ${b1}), (${a2} + ${b2})]. Submit in format: [bats, footballs] e.g. [20, 24] or simply "20, 24".`
        ]
      };
    },
    evaluate: (vars) => `${vars.a1 + vars.b1}, ${vars.a2 + vars.b2}`,
    explanation: (vars) => {
      const sum1 = vars.a1 + vars.b1;
      const sum2 = vars.a2 + vars.b2;
      return `Step 1: Set up matrix sum → [${vars.a1}, ${vars.a2}] + [${vars.b1}, ${vars.b2}]\n` +
             `Step 2: Add matching indices → [${vars.a1} + ${vars.b1}, ${vars.a2} + ${vars.b2}]\n` +
             `Step 3: Find combined matrix → [${sum1}, ${sum2}]`;
    },
    transferMapping: "Aggregating inventory across multiple business divisions is modeled as standard matrix addition."
  }
];

const anglesScenarios = [
  {
    scenarioId: 'ang-transfer-001',
    context: 'travel',
    transferLevel: 2,
    icon: '🚂',
    generate: () => {
      const a = [30, 45, 60, 120, 135, 150][Math.floor(Math.random() * 6)];
      const vars = { a };
      return {
        scenarioId: 'ang-transfer-001',
        context: 'travel',
        prompt: `Two railway tracks intersect at a crossing. If one of the vertically opposite angles formed is ${a} degrees, what is the value of the adjacent angle?`,
        variables: vars,
        hints: [
          `Angles on a straight line add up to 180 degrees.`,
          `The vertically opposite angle is also ${a} degrees, but the adjacent angle forms a straight line.`,
          `Subtract ${a} from 180 to find the adjacent angle.`
        ]
      };
    },
    evaluate: (vars) => 180 - vars.a,
    explanation: (vars) => `Step 1: Set up the supplementary angle equation → ${vars.a} + x = 180\nStep 2: Solve for x → 180 - ${vars.a} = ${180 - vars.a} degrees`,
    transferMapping: "Intersecting railways form straight-line angles that add up to 180 degrees (supplementary angles)."
  }
];

const basicarithScenarios = [
  {
    scenarioId: 'arith-transfer-001',
    context: 'shopping',
    transferLevel: 2,
    icon: '🛒',
    generate: () => {
      const a = [3, 4, 5][Math.floor(Math.random() * 3)];
      const b = [20, 30, 40][Math.floor(Math.random() * 3)];
      const c = [2, 3][Math.floor(Math.random() * 2)];
      const d = [50, 60, 70][Math.floor(Math.random() * 3)];
      const vars = { a, b, c, d };
      return {
        scenarioId: 'arith-transfer-001',
        context: 'shopping',
        prompt: `Arjun buys ${a} notebooks at ₹${b} each, and ${c} binders at ₹${d} each. What is his total bill in rupees?`,
        variables: vars,
        hints: [
          `Multiply the number of notebooks by their price: ${a} × ${b}.`,
          `Multiply the number of binders by their price: ${c} × ${d}.`,
          `Add the two totals to find the overall bill.`
        ]
      };
    },
    evaluate: (vars) => vars.a * vars.b + vars.c * vars.d,
    explanation: (vars) => `Step 1: Notebook cost → ${vars.a} × ₹${vars.b} = ₹${vars.a * vars.b}\nStep 2: Binder cost → ${vars.c} × ₹${vars.d} = ₹${vars.c * vars.d}\nStep 3: Total bill → ₹${vars.a * vars.b} + ₹${vars.c * vars.d} = ₹${vars.a * vars.b + vars.c * vars.d}`,
    transferMapping: "Compound purchases map directly to simple multiplication and addition operations."
  }
];

const bankingScenarios = [
  {
    scenarioId: 'bank-transfer-001',
    context: 'pocketmoney',
    transferLevel: 3,
    icon: '🪙',
    generate: () => {
      const p = [500, 1000][Math.floor(Math.random() * 2)];
      const r = [6, 12][Math.floor(Math.random() * 2)];
      const n = [12, 24][Math.floor(Math.random() * 2)];
      const vars = { p, r, n };
      return {
        scenarioId: 'bank-transfer-001',
        context: 'pocketmoney',
        prompt: `Meena opens a Recurring Deposit (RD) account and deposits ₹${p} every month for ${n} months. The bank offers simple interest of ${r}% per annum. What is the total maturity value (Deposited amount + Interest) at the end?`,
        variables: vars,
        hints: [
          `Total deposit is Principal × Months = ₹${p} × ${n}.`,
          `Interest is calculated as: I = P × N(N+1)/2 × (1/12) × (R/100).`,
          `Sum up the total deposit and the interest to find the maturity value.`
        ]
      };
    },
    evaluate: (vars) => {
      const dep = vars.p * vars.n;
      const interest = vars.p * (vars.n * (vars.n + 1) / 2) * (1 / 12) * (vars.r / 100);
      return Math.round(dep + interest);
    },
    explanation: (vars) => {
      const dep = vars.p * vars.n;
      const interest = vars.p * (vars.n * (vars.n + 1) / 2) * (1 / 12) * (vars.r / 100);
      return `Step 1: Total Principal deposited → ${vars.p} × ${vars.n} = ₹${dep}\n` +
             `Step 2: Calculate Simple Interest → ₹${Math.round(interest)}\n` +
             `Step 3: Maturity value → ₹${dep} + ₹${Math.round(interest)} = ₹${Math.round(dep + interest)}`;
    },
    transferMapping: "Recurring Deposit interest calculations map to summation series and simple interest formulas."
  }
];

const bearingsScenarios = [
  {
    scenarioId: 'bear-transfer-001',
    context: 'travel',
    transferLevel: 2,
    icon: '🚂',
    generate: () => {
      const b = [60, 120, 240, 300][Math.floor(Math.random() * 4)];
      const vars = { b };
      return {
        scenarioId: 'bear-transfer-001',
        context: 'travel',
        prompt: `A ship sails from Port A to Port B on a bearing of ${String(b).padStart(3, '0')}°. What bearing should the ship take to return back to Port A from Port B?`,
        variables: vars,
        hints: [
          `The return bearing is the back bearing (opposite direction).`,
          `If the bearing is less than 180°, add 180°. If it is 180° or more, subtract 180°.`,
          `Since the bearing is ${b}°, calculate the back bearing accordingly.`
        ]
      };
    },
    evaluate: (vars) => (vars.b < 180 ? vars.b + 180 : vars.b - 180),
    explanation: (vars) => {
      const ans = vars.b < 180 ? vars.b + 180 : vars.b - 180;
      return `Step 1: Identify if bearing ${vars.b}° is < or >= 180°\n` +
             `Step 2: Calculate back bearing → ${vars.b}° ${vars.b < 180 ? '+' : '-'} 180° = ${String(ans).padStart(3, '0')}°`;
    },
    transferMapping: "Back bearings in navigation represent a 180-degree rotation of the bearing vector."
  }
];

const binomialScenarios = [
  {
    scenarioId: 'binom-transfer-001',
    context: 'sports',
    transferLevel: 3,
    icon: '🏏',
    generate: () => {
      const n = [4, 5, 6][Math.floor(Math.random() * 3)];
      const k = [2, 3][Math.floor(Math.random() * 2)];
      const vars = { n, k };
      return {
        scenarioId: 'binom-transfer-001',
        context: 'sports',
        prompt: `A cricket batsman has a probability of hitting a boundary on any ball. To model outcomes across ${n} balls, we find combinations of successes. What is the binomial coefficient C(${n}, ${k}) (the number of ways to hit exactly ${k} boundaries in ${n} balls)?`,
        variables: vars,
        hints: [
          `The coefficient is given by the combination formula: n! / (k! × (n-k)!).`,
          `Substitute n = ${n} and k = ${k}.`,
          `Calculate combinations directly.`
        ]
      };
    },
    evaluate: (vars) => {
      const fact = (num) => num <= 1 ? 1 : num * fact(num - 1);
      return fact(vars.n) / (fact(vars.k) * fact(vars.n - vars.k));
    },
    explanation: (vars) => {
      const fact = (num) => num <= 1 ? 1 : num * fact(num - 1);
      const ans = fact(vars.n) / (fact(vars.k) * fact(vars.n - vars.k));
      return `Step 1: Combinations formula → C(n, k) = n! / (k! (n-k)!)\n` +
             `Step 2: Solve C(${vars.n}, ${vars.k}) → ${vars.n}! / (${vars.k}! × ${vars.n - vars.k}!) = ${ans}`;
    },
    transferMapping: "Binomial coefficient expansions calculate counts of favorable permutations in multi-stage trials."
  }
];

const boundsScenarios = [
  {
    scenarioId: 'bounds-transfer-001',
    context: 'cooking',
    transferLevel: 2,
    icon: '🍕',
    generate: () => {
      const val = [12, 15, 20][Math.floor(Math.random() * 3)];
      const vars = { val };
      return {
        scenarioId: 'bounds-transfer-001',
        context: 'cooking',
        prompt: `A cake recipe requires a flour package weight of ${val} kg, measured to the nearest whole kg. What is the lower bound (minimum possible actual weight) of this flour package?`,
        variables: vars,
        hints: [
          `To the nearest whole kg, the accuracy is 1 kg.`,
          `The margin is half of the accuracy: 1 / 2 = 0.5 kg.`,
          `Subtract 0.5 kg from the measured value of ${val} kg to find the lower bound.`
        ]
      };
    },
    evaluate: (vars) => vars.val - 0.5,
    explanation: (vars) => `Step 1: Identify margin of accuracy → 1 kg / 2 = 0.5 kg\nStep 2: Subtract margin for lower bound → ${vars.val} - 0.5 = ${vars.val - 0.5} kg`,
    transferMapping: "Measurement bounds represent limits of continuous intervals created by rounding errors."
  }
];

const circmeasureScenarios = [
  {
    scenarioId: 'circ-transfer-001',
    context: 'travel',
    transferLevel: 2,
    icon: '🚂',
    generate: () => {
      const r = [10, 14, 20][Math.floor(Math.random() * 3)];
      const theta = [0.5, 1.2, 1.5][Math.floor(Math.random() * 3)];
      const vars = { r, theta };
      return {
        scenarioId: 'circ-transfer-001',
        context: 'travel',
        prompt: `A railway track curves along a sector of a circle of radius ${r} meters. If the track subtends an angle of ${theta} radians at the center, what is the length of the curved track in meters?`,
        variables: vars,
        hints: [
          `The arc length of a circle is given by: s = r × θ, where θ is in radians.`,
          `Multiply radius (${r}) by the angle (${theta} radians).`,
          `No degree conversion is needed since the angle is already in radians.`
        ]
      };
    },
    evaluate: (vars) => Math.round((vars.r * vars.theta) * 100) / 100,
    explanation: (vars) => `Step 1: Arc length formula → s = r × θ\nStep 2: Multiply values → ${vars.r} × ${vars.theta} = ${Math.round((vars.r * vars.theta) * 100) / 100} meters`,
    transferMapping: "The curved distance of circular sectors is evaluated directly using the radian definition: arc = radius × angle."
  }
];

const circlethScenarios = [
  {
    scenarioId: 'circleth-transfer-001',
    context: 'travel',
    transferLevel: 2,
    icon: '🚂',
    generate: () => {
      const angle = 90;
      const vars = { angle };
      return {
        scenarioId: 'circleth-transfer-001',
        context: 'travel',
        prompt: `A semi-circular bridge arch has a steel support beam spanning the diameter. Another beam connects a point on the arch to the two ends of the diameter. What is the angle in degrees formed at the arch point?`,
        variables: vars,
        hints: [
          `Recall Thales' Theorem / Circle Theorems: The angle subtended by a diameter in a semicircle is always a right angle.`,
          `This geometric rule is independent of the bridge's diameter or height.`,
          `A right angle is exactly 90 degrees.`
        ]
      };
    },
    evaluate: (vars) => 90,
    explanation: (vars) => `Step 1: Apply circle theorem → Angle subtended by a diameter at any point on a semicircle is 90°.\nStep 2: Output the constant angle → 90°`,
    transferMapping: "Geometric symmetry in circular structures guarantees constant right angles for points subtending diameters."
  }
];

const complexScenarios = [
  {
    scenarioId: 'comp-transfer-001',
    context: 'sports',
    transferLevel: 2,
    icon: '🏏',
    generate: () => {
      const r1 = [3, 4, 5][Math.floor(Math.random() * 3)];
      const x1 = [2, 3, 4][Math.floor(Math.random() * 3)];
      const r2 = [2, 3, 6][Math.floor(Math.random() * 3)];
      const x2 = [1, 5, 6][Math.floor(Math.random() * 3)];
      const vars = { r1, x1, r2, x2 };
      return {
        scenarioId: 'comp-transfer-001',
        context: 'sports',
        prompt: `An AC electric circuit has two components in series. The first impedance is Z1 = ${r1} + ${x1}i ohms, and the second is Z2 = ${r2} + ${x2}i ohms. Find the total impedance (series sum Z1 + Z2) in standard form (e.g. 5+7i or simply 5 + 7i).`,
        variables: vars,
        hints: [
          `To add complex numbers, add their real parts together and their imaginary parts together.`,
          `Real part sum: ${r1} + ${r2}.`,
          `Imaginary part sum: ${x1} + ${x2}.`
        ]
      };
    },
    evaluate: (vars) => `${vars.r1 + vars.r2}+${vars.x1 + vars.x2}i`,
    explanation: (vars) => {
      const real = vars.r1 + vars.r2;
      const imag = vars.x1 + vars.x2;
      return `Step 1: Add real parts → ${vars.r1} + ${vars.r2} = ${real}\n` +
             `Step 2: Add imaginary parts → (${vars.x1} + ${vars.x2})i = ${imag}i\n` +
             `Step 3: Combine → ${real} + ${imag}i`;
    },
    transferMapping: "Complex addition combines independent real components (resistances) and imaginary components (reactances)."
  }
];

const congruenceScenarios = [
  {
    scenarioId: 'cong-transfer-001',
    context: 'cooking',
    transferLevel: 2,
    icon: '🍕',
    generate: () => {
      const ans = 'SSS';
      const vars = { ans };
      return {
        scenarioId: 'cong-transfer-001',
        context: 'cooking',
        prompt: `A bakery makes triangular pastries. They verify that two pastries have matching side lengths of 6 cm, 8 cm, and 10 cm. Which congruence criterion guarantees they are identical shapes? (Enter SSS, SAS, ASA, or RHS)`,
        variables: vars,
        hints: [
          `The pastries have three pairs of equal sides.`,
          `Side-Side-Side congruence corresponds to SSS.`,
          `Verify spelling: enter 'SSS'.`
        ]
      };
    },
    evaluate: (vars) => 'SSS',
    explanation: (vars) => `Step 1: Check match → Three sides of one triangle match three sides of another.\nStep 2: Congruence Criterion → SSS`,
    transferMapping: "Congruence criteria define sets of minimal constraints ensuring geometric equivalence."
  }
];

const conicsScenarios = [
  {
    scenarioId: 'conics-transfer-001',
    context: 'travel',
    transferLevel: 3,
    icon: '🚂',
    generate: () => {
      const width = [8, 12, 16][Math.floor(Math.random() * 3)];
      const vars = { width };
      return {
        scenarioId: 'conics-transfer-001',
        context: 'travel',
        prompt: `A satellite communication dish has a parabolic cross-section. Its shape is modeled by y = x² / (4f). If the dish has a diameter (width) of ${width} meters and a depth of 2 meters, what is the focal distance f in meters?`,
        variables: vars,
        hints: [
          `The boundary point of the dish is at coordinate (x, y) = (Diameter/2, Depth) = (${width / 2}, 2).`,
          `Substitute x = ${width / 2} and y = 2 into y = x² / (4f).`,
          `Solve the equation: 2 = ${width / 2}² / (4f).`
        ]
      };
    },
    evaluate: (vars) => (vars.width * vars.width) / 32,
    explanation: (vars) => {
      const x = vars.width / 2;
      const ans = (vars.width * vars.width) / 32;
      return `Step 1: Find boundary point → (x, y) = (${x}, 2)\n` +
             `Step 2: Set up equation → 2 = ${x}² / (4f) → 8f = ${x * x}\n` +
             `Step 3: Solve for f → f = ${x * x} / 8 = ${ans} meters`;
    },
    transferMapping: "Parabolic surfaces focus radiation to points defined by the focal variable equation: y = x^2 / (4f)."
  }
];

const coordgeomScenarios = [
  {
    scenarioId: 'coord-transfer-001',
    context: 'travel',
    transferLevel: 2,
    icon: '🚂',
    generate: () => {
      const x1 = [2, 4, 6][Math.floor(Math.random() * 3)];
      const y1 = [3, 5, 7][Math.floor(Math.random() * 3)];
      const x2 = [8, 10, 12][Math.floor(Math.random() * 3)];
      const y2 = [9, 11, 13][Math.floor(Math.random() * 3)];
      const vars = { x1, y1, x2, y2 };
      return {
        scenarioId: 'coord-transfer-001',
        context: 'travel',
        prompt: `A new gas pipeline is laid in a straight line between Station A at coordinates (${x1}, ${y1}) and Station B at (${x2}, ${y2}). What are the coordinates of the midpoint where a relief valve should be placed? (Submit as x, y e.g. 5, 7)`,
        variables: vars,
        hints: [
          `Use the midpoint formula: Midpoint = ((x1 + x2)/2, (y1 + y2)/2).`,
          `X coordinate: (${x1} + ${x2}) / 2.`,
          `Y coordinate: (${y1} + ${y2}) / 2.`
        ]
      };
    },
    evaluate: (vars) => `${(vars.x1 + vars.x2) / 2}, ${(vars.y1 + vars.y2) / 2}`,
    explanation: (vars) => {
      const mx = (vars.x1 + vars.x2) / 2;
      const my = (vars.y1 + vars.y2) / 2;
      return `Step 1: Midpoint X → (${vars.x1} + ${vars.x2}) / 2 = ${mx}\n` +
             `Step 2: Midpoint Y → (${vars.y1} + ${vars.y2}) / 2 = ${my}\n` +
             `Step 3: Midpoint coordinates → ${mx}, ${my}`;
    },
    transferMapping: "Finding the center of linear installations translates directly to coordinate midpoint formulas."
  }
];

const diffScenarios = [
  {
    scenarioId: 'diff-transfer-001',
    context: 'shopping',
    transferLevel: 3,
    icon: '🛒',
    generate: () => {
      const a = [2, 3][Math.floor(Math.random() * 2)];
      const b = [40, 50][Math.floor(Math.random() * 2)];
      const x = [5, 10][Math.floor(Math.random() * 2)];
      const vars = { a, b, x };
      return {
        scenarioId: 'diff-transfer-001',
        context: 'shopping',
        prompt: `A company's total revenue in rupees from selling x units is given by R(x) = -${a}x² + ${b}x + 500. What is the marginal revenue (rate of change of revenue dR/dx) when they sell exactly ${x} units?`,
        variables: vars,
        hints: [
          `Find the derivative of the revenue function R(x).`,
          `The derivative of R(x) is R'(x) = -2 × ${a}x + ${b}.`,
          `Substitute x = ${x} into the derivative.`
        ]
      };
    },
    evaluate: (vars) => -2 * vars.a * vars.x + vars.b,
    explanation: (vars) => {
      const derivCoeff = -2 * vars.a;
      const ans = derivCoeff * vars.x + vars.b;
      return `Step 1: Differentiate R(x) → R'(x) = ${derivCoeff}x + ${vars.b}\n` +
             `Step 2: Substitute x = ${vars.x} → ${derivCoeff}(${vars.x}) + ${vars.b} = ${ans}`;
    },
    transferMapping: "Marginal revenue represents the derivative (rate of change) of a pricing function."
  }
];

const diffeqScenarios = [
  {
    scenarioId: 'diffeq-transfer-001',
    context: 'sports',
    transferLevel: 2,
    icon: '🏏',
    generate: () => {
      const vars = {};
      return {
        scenarioId: 'diffeq-transfer-001',
        context: 'sports',
        prompt: `A thermal cooling model is represented by the differential equation: (d²T/dt²)³ - 5(dT/dt) + 2T = 0. What is the order of this differential equation?`,
        variables: vars,
        hints: [
          `Order is the highest derivative present in the equation.`,
          `The highest derivative in this equation is d²T/dt² (the second derivative).`,
          `The order is therefore 2.`
        ]
      };
    },
    evaluate: (vars) => 2,
    explanation: (vars) => `Step 1: Find highest derivative order present → d²T/dt² represents second order.\nStep 2: Order is 2.`,
    transferMapping: "The order of differential models matches the order of their highest derivative element."
  }
];

const funcevalScenarios = [
  {
    scenarioId: 'func-transfer-001',
    context: 'shopping',
    transferLevel: 2,
    icon: '🛒',
    generate: () => {
      const a = [5, 8, 10][Math.floor(Math.random() * 3)];
      const b = [3, 4, 6][Math.floor(Math.random() * 3)];
      const x = [5, 10, 15][Math.floor(Math.random() * 3)];
      const y = [10, 20][Math.floor(Math.random() * 2)];
      const vars = { a, b, x, y };
      return {
        scenarioId: 'func-transfer-001',
        context: 'shopping',
        prompt: `A factory's production cost is modeled by the function C(x, y) = ${a}x + ${b}y + 120. Find the total production cost in rupees if they produce x = ${x} units of item A and y = ${y} units of item B.`,
        variables: vars,
        hints: [
          `Evaluate the function C(x, y) by substituting x = ${x} and y = ${y}.`,
          `Calculate: ${a} × ${x} + ${b} × ${y} + 120.`,
          `Add the values to get the final cost.`
        ]
      };
    },
    evaluate: (vars) => vars.a * vars.x + vars.b * vars.y + 120,
    explanation: (vars) => {
      const term1 = vars.a * vars.x;
      const term2 = vars.b * vars.y;
      const ans = term1 + term2 + 120;
      return `Step 1: Substitute variables → C(${vars.x}, ${vars.y}) = ${vars.a}(${vars.x}) + ${vars.b}(${vars.y}) + 120\n` +
             `Step 2: Compute terms → ${term1} + ${term2} + 120 = ₹${ans}`;
    },
    transferMapping: "Evaluating factory costing functions involves substituting independent quantities into multi-variable functions."
  }
];

const gstScenarios = [
  {
    scenarioId: 'gst-transfer-001',
    context: 'shopping',
    transferLevel: 2,
    icon: '🛒',
    generate: () => {
      const price = [100, 200, 500, 1000][Math.floor(Math.random() * 4)];
      const rate = [5, 12, 18][Math.floor(Math.random() * 3)];
      const vars = { price, rate };
      return {
        scenarioId: 'gst-transfer-001',
        context: 'shopping',
        prompt: `A merchant sells a jacket for ₹${price} before taxes. If the GST rate is ${rate}%, what is the GST amount charged on this sale in rupees?`,
        variables: vars,
        hints: [
          `The GST amount is calculated as a percentage of the base price.`,
          `Multiply the base price ₹${price} by the tax rate ${rate}%, and divide by 100.`,
          `Formula: GST Amount = Price × (Rate / 100).`
        ]
      };
    },
    evaluate: (vars) => Math.round((vars.price * (vars.rate / 100)) * 100) / 100,
    explanation: (vars) => {
      const ans = Math.round((vars.price * (vars.rate / 100)) * 100) / 100;
      return `Step 1: Calculate GST fraction → ${vars.rate} / 100 = ${vars.rate / 100}\n` +
             `Step 2: Multiply by base price → ₹${vars.price} × ${vars.rate / 100} = ₹${ans}`;
    },
    transferMapping: "GST calculations apply percentage rates to base transaction values."
  }
];

const indicesScenarios = [
  {
    scenarioId: 'ind-transfer-001',
    context: 'cooking',
    transferLevel: 2,
    icon: '🍕',
    generate: () => {
      const initial = [100, 200, 500][Math.floor(Math.random() * 3)];
      const hours = [3, 4, 5][Math.floor(Math.random() * 3)];
      const vars = { initial, hours };
      return {
        scenarioId: 'ind-transfer-001',
        context: 'cooking',
        prompt: `A yogurt culture contains an initial bacterial count of ${initial}. If the population doubles every hour (increases by a factor of 2^t after t hours), what is the total bacterial count after ${hours} hours?`,
        variables: vars,
        hints: [
          `The population after t hours is: Initial × 2^t.`,
          `Calculate 2 raised to the power of ${hours} first (2^${hours} = ${Math.pow(2, hours)}).`,
          `Multiply that value by the initial count of ${initial}.`
        ]
      };
    },
    evaluate: (vars) => vars.initial * Math.pow(2, vars.hours),
    explanation: (vars) => {
      const factor = Math.pow(2, vars.hours);
      const ans = vars.initial * factor;
      return `Step 1: Compute exponential growth factor → 2^${vars.hours} = ${factor}\n` +
             `Step 2: Multiply by initial count → ${vars.initial} × ${factor} = ${ans}`;
    },
    transferMapping: "Growth double steps correspond directly to base-2 exponential functions (2^t)."
  }
];

const multiplyScenarios = [
  {
    scenarioId: 'mul-transfer-001',
    context: 'travel',
    transferLevel: 2,
    icon: '🚂',
    generate: () => {
      const rows = [12, 15, 18, 20][Math.floor(Math.random() * 4)];
      const seats = [6, 8, 10][Math.floor(Math.random() * 3)];
      const vars = { rows, seats };
      return {
        scenarioId: 'mul-transfer-001',
        context: 'travel',
        prompt: `An express train compartment has ${rows} rows of seats, with exactly ${seats} seats in each row. What is the total seating capacity of the compartment?`,
        variables: vars,
        hints: [
          `Multiply the number of rows by the number of seats per row.`,
          `Calculation: ${rows} × ${seats}.`
        ]
      };
    },
    evaluate: (vars) => vars.rows * vars.seats,
    explanation: (vars) => `Step 1: Set up product → ${vars.rows} rows × ${vars.seats} seats/row\nStep 2: Multiply → ${vars.rows * vars.seats} seats`,
    transferMapping: "Grid-based capacity aggregates correspond to standard multiplication."
  }
];

const primefactorScenarios = [
  {
    scenarioId: 'prime-transfer-001',
    context: 'cooking',
    transferLevel: 2,
    icon: '🍕',
    generate: () => {
      const val = [30, 42, 60, 70][Math.floor(Math.random() * 4)];
      const vars = { val };
      return {
        scenarioId: 'prime-transfer-001',
        context: 'cooking',
        prompt: `A bakery divides a large sheet cake of area ${val} square inches into smaller square portions with prime-number dimensions. What is the product of prime factors for the number ${val}? (Submit as factors separated by multiplication signs, e.g. 2 * 3 * 5)`,
        variables: vars,
        hints: [
          `Find the prime factors of ${val} by dividing by the smallest primes.`,
          `For example, if the number was 30, it is 2 × 3 × 5.`,
          `Write the prime factors in ascending order separated by ' * '.`
        ]
      };
    },
    evaluate: (vars) => {
      let n = vars.val;
      const factors = [];
      for (let i = 2; i <= n; i++) {
        while (n % i === 0) {
          factors.push(i);
          n /= i;
        }
      }
      return factors.join(' * ');
    },
    explanation: (vars) => {
      let n = vars.val;
      const factors = [];
      for (let i = 2; i <= n; i++) {
        while (n % i === 0) {
          factors.push(i);
          n /= i;
        }
      }
      return `Step 1: Divide by smallest prime factors → ${vars.val} = ${factors.join(' × ')}`;
    },
    transferMapping: "Decomposing numbers into indivisible factors matches prime factorization."
  }
];

const profitlossScenarios = [
  {
    scenarioId: 'pl-transfer-001',
    context: 'shopping',
    transferLevel: 2,
    icon: '🛒',
    generate: () => {
      const cp = [200, 400, 500, 800][Math.floor(Math.random() * 4)];
      const profit = [50, 100, 200][Math.floor(Math.random() * 3)];
      const sp = cp + profit;
      const vars = { cp, sp };
      return {
        scenarioId: 'pl-transfer-001',
        context: 'shopping',
        prompt: `A merchant buys a handbag for ₹${cp} and sells it to a customer for ₹${sp}. What is the merchant's profit percentage?`,
        variables: vars,
        hints: [
          `Find the absolute profit first: Selling Price - Cost Price = ₹${sp} - ₹${cp} = ₹${sp - cp}.`,
          `Calculate the profit percentage based on the Cost Price: (Profit / Cost Price) × 100.`,
          `Calculate: (${sp - cp} / ${cp}) × 100.`
        ]
      };
    },
    evaluate: (vars) => Math.round(((vars.sp - vars.cp) / vars.cp) * 100 * 100) / 100,
    explanation: (vars) => {
      const diff = vars.sp - vars.cp;
      const ans = Math.round((diff / vars.cp) * 100 * 100) / 100;
      return `Step 1: Find profit amount → ₹${vars.sp} - ₹${vars.cp} = ₹${diff}\n` +
             `Step 2: Find profit percentage → (₹${diff} / ₹${vars.cp}) × 100 = ${ans}%`;
    },
    transferMapping: "Profit percentages express absolute profits relative to the initial cost price."
  }
];

const pythagScenarios = [
  {
    scenarioId: 'pythag-transfer-001',
    context: 'travel',
    transferLevel: 2,
    icon: '🚂',
    generate: () => {
      const base = [6, 8, 12][Math.floor(Math.random() * 3)];
      const height = [8, 15, 16][Math.floor(Math.random() * 3)];
      const vars = { base, height };
      return {
        scenarioId: 'pythag-transfer-001',
        context: 'travel',
        prompt: `A hiker travels ${base} km due East, then changes direction and walks ${height} km due North. What is the direct distance from the hiker's starting position to the destination in km?`,
        variables: vars,
        hints: [
          `East and North form a right-angled triangle.`,
          `Use Pythagoras' Theorem: Hypotenuse² = Base² + Height².`,
          `Calculate: √(${base}² + ${height}²) = √(${base * base} + ${height * height}).`
        ]
      };
    },
    evaluate: (vars) => Math.round(Math.sqrt(vars.base * vars.base + vars.height * vars.height) * 100) / 100,
    explanation: (vars) => {
      const sum = vars.base * vars.base + vars.height * vars.height;
      const ans = Math.round(Math.sqrt(sum) * 100) / 100;
      return `Step 1: Set up Pythagoras → D² = ${vars.base}² + ${vars.height}²\n` +
             `Step 2: Add square values → D² = ${vars.base * vars.base} + ${vars.height * vars.height} = ${sum}\n` +
             `Step 3: Solve square root → D = √${sum} = ${ans} km`;
    },
    transferMapping: "Right-angle spatial displacement maps directly to Pythagoras' theorem hypotenuse formulas."
  }
];

const remfactorScenarios = [
  {
    scenarioId: 'rem-transfer-001',
    context: 'sports',
    transferLevel: 3,
    icon: '🏏',
    generate: () => {
      const k = [2, 3][Math.floor(Math.random() * 2)];
      const vars = { k };
      return {
        scenarioId: 'rem-transfer-001',
        context: 'sports',
        prompt: `A tournament splits teams according to the polynomial P(x) = x³ - 4x² + 5x - 2. If the players are divided into groups of (x - ${k}), what is the remainder of this polynomial division?`,
        variables: vars,
        hints: [
          `By the Remainder Theorem, the remainder of dividing P(x) by (x - k) is simply P(k).`,
          `Substitute x = ${k} into the polynomial equation.`,
          `Calculate: ${k}³ - 4(${k}²) + 5(${k}) - 2.`
        ]
      };
    },
    evaluate: (vars) => {
      const k = vars.k;
      return k * k * k - 4 * k * k + 5 * k - 2;
    },
    explanation: (vars) => {
      const k = vars.k;
      const ans = k * k * k - 4 * k * k + 5 * k - 2;
      return `Step 1: Remainder theorem → Remainder = P(${k})\n` +
             `Step 2: Substitute and compute → (${k}³) - 4(${k}²) + 5(${k}) - 2 = ${ans}`;
    },
    transferMapping: "Remainder values of polynomial divisions are determined by evaluating functions at the divisor roots."
  }
];

const roundingScenarios = [
  {
    scenarioId: 'round-transfer-001',
    context: 'shopping',
    transferLevel: 2,
    icon: '🛒',
    generate: () => {
      const price = [45.67, 123.45, 89.95][Math.floor(Math.random() * 3)];
      const vars = { price };
      return {
        scenarioId: 'round-transfer-001',
        context: 'shopping',
        prompt: `An item is priced at ₹${price}. If a buyer rounds this price to the nearest whole rupee, what estimated amount will they pay?`,
        variables: vars,
        hints: [
          `Look at the decimal part (paisa). If it is .50 or higher, round up to the next rupee.`,
          `If the decimal part is less than .50, round down by removing the decimals.`,
          `For ₹${price}, evaluate the decimal part.`
        ]
      };
    },
    evaluate: (vars) => Math.round(vars.price),
    explanation: (vars) => `Step 1: Check fractional decimal part → ${vars.price}\nStep 2: Round to nearest whole integer → ₹${Math.round(vars.price)}`,
    transferMapping: "Estimated transaction values map directly to integer rounding operations."
  }
];

const sectionScenarios = [
  {
    scenarioId: 'sec-transfer-001',
    context: 'travel',
    transferLevel: 2,
    icon: '🚂',
    generate: () => {
      const x1 = 0, y1 = 0;
      const x2 = 10, y2 = 20;
      const m1 = 1, m2 = 1;
      const vars = { x1, y1, x2, y2, m1, m2 };
      return {
        scenarioId: 'sec-transfer-001',
        context: 'travel',
        prompt: `A highway has two toll gates at coordinates (${x1}, ${y1}) and (${x2}, ${y2}). A patrol booth divides the segment between them in a 1:1 ratio. What are the coordinates of the patrol booth? (Submit as x, y)`,
        variables: vars,
        hints: [
          `A 1:1 division represents the midpoint.`,
          `Calculate the average of coordinates: ((x1 + x2)/2, (y1 + y2)/2).`,
          `Toll midpoint is ((${x1} + ${x2})/2, (${y1} + ${y2})/2).`
        ]
      };
    },
    evaluate: (vars) => '5, 10',
    explanation: (vars) => `Step 1: Apply section formula with ratio 1:1 → ((0+10)/2, (0+20)/2)\nStep 2: Midpoint is 5, 10`,
    transferMapping: "Proportional coordinate divisions utilize standard section formulas."
  }
];

const sequencesScenarios = [
  {
    scenarioId: 'seq-transfer-001',
    context: 'pocketmoney',
    transferLevel: 2,
    icon: '🪙',
    generate: () => {
      const a = [50, 100][Math.floor(Math.random() * 2)];
      const d = [10, 20, 50][Math.floor(Math.random() * 3)];
      const n = [5, 10][Math.floor(Math.random() * 2)];
      const vars = { a, d, n };
      return {
        scenarioId: 'seq-transfer-001',
        context: 'pocketmoney',
        prompt: `Ananya decides to save money weekly. She saves ₹${a} in the first week, and increases her savings by ₹${d} every subsequent week. How much money does she save in week ${n}?`,
        variables: vars,
        hints: [
          `This savings progression forms an Arithmetic Progression (AP) with first term a = ${a} and common difference d = ${d}.`,
          `The formula for the N-th term is: T_n = a + (n - 1) × d.`,
          `Calculate: ${a} + (${n} - 1) × ${d}.`
        ]
      };
    },
    evaluate: (vars) => vars.a + (vars.n - 1) * vars.d,
    explanation: (vars) => {
      const term = vars.a + (vars.n - 1) * vars.d;
      return `Step 1: Identify AP variables → a = ₹${vars.a}, d = ₹${vars.d}, n = ${vars.n}\n` +
             `Step 2: Apply term formula → ${vars.a} + (${vars.n} - 1) × ${vars.d} = ₹${term}`;
    },
    transferMapping: "Incremental periodic growth profiles represent arithmetic progressions (AP)."
  }
];

const sharesScenarios = [
  {
    scenarioId: 'shares-transfer-001',
    context: 'shopping',
    transferLevel: 3,
    icon: '🛒',
    generate: () => {
      const n = [100, 200, 500][Math.floor(Math.random() * 3)];
      const nv = 10;
      const divRate = [5, 8, 10][Math.floor(Math.random() * 3)];
      const vars = { n, nv, divRate };
      return {
        scenarioId: 'shares-transfer-001',
        context: 'shopping',
        prompt: `An investor owns ${n} shares of a company. Each share has a nominal face value of ₹${nv}. If the company declares a dividend of ${divRate}%, what is the total dividend amount received in rupees?`,
        variables: vars,
        hints: [
          `First find the total face value of the shares: Number of Shares × Face Value = ${n} × ₹${nv}.`,
          `The dividend amount is calculated as a percentage of this total face value.`,
          `Calculate: (Total Face Value) × (Dividend Rate / 100) = (₹${n * nv}) × (${divRate} / 100).`
        ]
      };
    },
    evaluate: (vars) => vars.n * vars.nv * (vars.divRate / 100),
    explanation: (vars) => {
      const totalFaceVal = vars.n * vars.nv;
      const ans = totalFaceVal * (vars.divRate / 100);
      return `Step 1: Total Face Value → ${vars.n} shares × ₹${vars.nv} = ₹${totalFaceVal}\n` +
             `Step 2: Calculate dividend → ₹${totalFaceVal} × ${vars.divRate}% = ₹${ans}`;
    },
    transferMapping: "Corporate dividends represent percentage returns computed exclusively on nominal face values."
  }
];

const setsScenarios = [
  {
    scenarioId: 'sets-transfer-001',
    context: 'sports',
    transferLevel: 2,
    icon: '🏏',
    generate: () => {
      const total = 50;
      const c = 30;
      const f = 25;
      const both = 10;
      const vars = { total, c, f, both };
      return {
        scenarioId: 'sets-transfer-001',
        context: 'sports',
        prompt: `In a survey of ${total} students, ${c} play cricket, ${f} play football, and ${both} play both sports. How many students do not play either sport?`,
        variables: vars,
        hints: [
          `Find the total students who play at least one sport using set union formula: n(C ∪ F) = n(C) + n(F) - n(C ∩ F).`,
          `Active students: ${c} + ${f} - ${both} = ${c + f - both}.`,
          `Subtract this number from the total surveyed students (${total}) to find those who do not play either.`
        ]
      };
    },
    evaluate: (vars) => vars.total - (vars.c + vars.f - vars.both),
    explanation: (vars) => {
      const union = vars.c + vars.f - vars.both;
      const ans = vars.total - union;
      return `Step 1: Find union of sports players → ${vars.c} + ${vars.f} - ${vars.both} = ${union}\n` +
             `Step 2: Subtract union from total → ${vars.total} - ${union} = ${ans}`;
    },
    transferMapping: "Overlap counts in grouping surveys utilize set intersection and union algebra."
  }
];

const similarityScenarios = [
  {
    scenarioId: 'sim-transfer-001',
    context: 'shopping',
    transferLevel: 3,
    icon: '🛒',
    generate: () => {
      const ratio = 2;
      const v1 = [50, 100, 200][Math.floor(Math.random() * 3)];
      const vars = { ratio, v1 };
      return {
        scenarioId: 'sim-transfer-001',
        context: 'shopping',
        prompt: `A prototype model of a storage box is similar to the production box. If the production box has side lengths exactly ${ratio} times larger than the prototype, and the prototype volume is ${v1} cm³, what is the volume of the production box in cm³?`,
        variables: vars,
        hints: [
          `For similar shapes, the volume ratio is the cube of the linear scale factor: Volume Ratio = (Scale Factor)³.`,
          `The volume scale factor is ${ratio}³ = 8.`,
          `Multiply the prototype volume (${v1} cm³) by 8.`
        ]
      };
    },
    evaluate: (vars) => vars.v1 * Math.pow(vars.ratio, 3),
    explanation: (vars) => {
      const scaleVol = Math.pow(vars.ratio, 3);
      const ans = vars.v1 * scaleVol;
      return `Step 1: Calculate volume scale factor → ${vars.ratio}³ = ${scaleVol}\n` +
             `Step 2: Scale prototype volume → ${vars.v1} cm³ × ${scaleVol} = ${ans} cm³`;
    },
    transferMapping: "Volume changes in similar physical models scale proportionally to the cube of their linear dimensions."
  }
];

const squaringScenarios = [
  {
    scenarioId: 'sq-transfer-001',
    context: 'cooking',
    transferLevel: 2,
    icon: '🍕',
    generate: () => {
      const side = [95, 105][Math.floor(Math.random() * 2)];
      const vars = { side };
      return {
        scenarioId: 'sq-transfer-001',
        context: 'cooking',
        prompt: `A square pizza box has side lengths of ${side} cm. What is the total area of the box base in cm²?`,
        variables: vars,
        hints: [
          `The area is side squared: ${side}².`,
          `You can calculate this easily using: (100 - 5)² = 10000 - 1000 + 25 = 9025 (or (100 + 5)² = 10000 + 1000 + 25 = 11025).`,
          `Multiply the side length by itself.`
        ]
      };
    },
    evaluate: (vars) => vars.side * vars.side,
    explanation: (vars) => `Step 1: Set up squaring formula → ${vars.side}²\nStep 2: Multiply → ${vars.side * vars.side} cm²`,
    transferMapping: "Determining square geometric surfaces corresponds directly to mathematical squaring."
  }
];

const simulScenarios = [
  {
    scenarioId: 'simul-transfer-001',
    context: 'shopping',
    transferLevel: 3,
    icon: '🛒',
    generate: () => {
      const vars = { a: 110, c: 160 };
      return {
        scenarioId: 'simul-transfer-001',
        context: 'shopping',
        prompt: `At a theater, 2 adult tickets and 3 child tickets cost a total of ₹700. If 1 adult ticket and 1 child ticket cost ₹270, what is the cost of a single adult ticket in rupees?`,
        variables: vars,
        hints: [
          `Let adult ticket price be A and child ticket price be C.`,
          `Form system of equations: (1) 2A + 3C = 700, (2) A + C = 270.`,
          `Multiply equation (2) by 3: 3A + 3C = 810. Subtract equation (1) from this to isolate A.`
        ]
      };
    },
    evaluate: (vars) => 110,
    explanation: (vars) => `Step 1: Set up system:\n  2A + 3C = 700\n  A + C = 270\nStep 2: Multiply Eq 2 by 3 → 3A + 3C = 810\nStep 3: Subtract Eq 1 → A = 110 rupees`,
    transferMapping: "Multi-parameter cost systems are resolved using simultaneous algebraic equations."
  }
];

const stdformScenarios = [
  {
    scenarioId: 'std-transfer-001',
    context: 'travel',
    transferLevel: 2,
    icon: '🚂',
    generate: () => {
      const vars = {};
      return {
        scenarioId: 'std-transfer-001',
        context: 'travel',
        prompt: `A star is located 3.0 × 10^13 kilometers from Earth. If a spacecraft travels at 1.5 × 10^4 kilometers per hour, how many hours will it take to reach the star? (Write answer in standard scientific format: e.g. 2e9 or 2.0e9)`,
        variables: vars,
        hints: [
          `Time is Distance divided by Speed.`,
          `Calculate: (3.0 × 10^13) / (1.5 × 10^4).`,
          `Subtract indices: 10^(13-4) = 10^9. Divide base numbers: 3.0 / 1.5 = 2. Answer format: 2e9.`
        ]
      };
    },
    evaluate: (vars) => '2e9',
    explanation: (vars) => `Step 1: Divide distance by speed → (3.0e13) / (1.5e4)\nStep 2: Divide coefficients and exponents → 2.0e9 hours`,
    transferMapping: "Large-scale division calculations utilize rules of scientific notation exponent subtraction."
  }
];

const statsScenarios = [
  {
    scenarioId: 'stat-transfer-001',
    context: 'sports',
    transferLevel: 2,
    icon: '🏏',
    generate: () => {
      const s1 = 40, s2 = 50, s3 = 60;
      const vars = { s1, s2, s3 };
      return {
        scenarioId: 'stat-transfer-001',
        context: 'sports',
        prompt: `A batsman scores ${s1}, ${s2}, and ${s3} runs in three consecutive innings. What is his mean batting score?`,
        variables: vars,
        hints: [
          `The mean is the sum of all scores divided by the number of innings.`,
          `Sum: ${s1} + ${s2} + ${s3} = ${s1 + s2 + s3}.`,
          `Divide the sum by 3.`
        ]
      };
    },
    evaluate: (vars) => (vars.s1 + vars.s2 + vars.s3) / 3,
    explanation: (vars) => `Step 1: Sum observations → ${vars.s1} + ${vars.s2} + ${vars.s3} = ${vars.s1 + vars.s2 + vars.s3}\nStep 2: Divide by sample count → ${vars.s1 + vars.s2 + vars.s3} / 3 = 50`,
    transferMapping: "Mean parameters represent central averages calculated across discrete sample lists."
  }
];

const surdsScenarios = [
  {
    scenarioId: 'surd-transfer-001',
    context: 'travel',
    transferLevel: 2,
    icon: '🚂',
    generate: () => {
      const vars = {};
      return {
        scenarioId: 'surd-transfer-001',
        context: 'travel',
        prompt: `A square walking park has a diagonal length modeled by the expression √18 + √8 meters. What is this distance in fully simplified surd form? (Submit as a√b e.g. 5√2)`,
        variables: vars,
        hints: [
          `Simplify each surd first: √18 = √(9×2) = 3√2.`,
          `Simplify second surd: √8 = √(4×2) = 2√2.`,
          `Add the simplified terms: 3√2 + 2√2 = 5√2.`
        ]
      };
    },
    evaluate: (vars) => '5√2',
    explanation: (vars) => `Step 1: Simplify components → √18 = 3√2 and √8 = 2√2\nStep 2: Sum terms → 3√2 + 2√2 = 5√2`,
    transferMapping: "Adding irrational surds requires expressing terms under a common radical."
  }
];

const transformScenarios = [
  {
    scenarioId: 'trans-transfer-001',
    context: 'shopping',
    transferLevel: 2,
    icon: '🛒',
    generate: () => {
      const x = 3, y = 4;
      const dx = 2, dy = 5;
      const vars = { x, y, dx, dy };
      return {
        scenarioId: 'trans-transfer-001',
        context: 'shopping',
        prompt: `A shape logo at coordinate (${x}, ${y}) is translated by the vector [${dx}, ${dy}]. What are the coordinates of the new logo vertex? (Submit as x, y)`,
        variables: vars,
        hints: [
          `Translation shifts coordinates by adding the vector values.`,
          `New X: ${x} + ${dx}.`,
          `New Y: ${y} + ${dy}.`
        ]
      };
    },
    evaluate: (vars) => `${vars.x + vars.dx}, ${vars.y + vars.dy}`,
    explanation: (vars) => `Step 1: Shift X coordinate → ${vars.x} + ${vars.dx} = ${vars.x + vars.dx}\nStep 2: Shift Y coordinate → ${vars.y} + ${vars.dy} = ${vars.y + vars.dy}`,
    transferMapping: "Coordinate translations shift indices linearly according to vector offsets."
  }
];

const trianglesScenarios = [
  {
    scenarioId: 'tri-transfer-001',
    context: 'cooking',
    transferLevel: 2,
    icon: '🍕',
    generate: () => {
      const a1 = 50, a2 = 60;
      const vars = { a1, a2 };
      return {
        scenarioId: 'tri-transfer-001',
        context: 'cooking',
        prompt: `A triangular napkin has two angles measuring ${a1}° and ${a2}°. What is the measurement of the third angle in degrees?`,
        variables: vars,
        hints: [
          `The sum of angles in a triangle is always 180 degrees.`,
          `Add the two known angles: ${a1} + ${a2} = ${a1 + a2}°.`,
          `Subtract that sum from 180°.`
        ]
      };
    },
    evaluate: (vars) => 180 - (vars.a1 + vars.a2),
    explanation: (vars) => `Step 1: Find sum of angles → ${vars.a1} + ${vars.a2} = ${vars.a1 + vars.a2}°\nStep 2: Subtract from 180° → 180 - ${vars.a1 + vars.a2} = ${180 - (vars.a1 + vars.a2)}°`,
    transferMapping: "Triangle angle sum properties are constrained by a constant sum of 180 degrees."
  }
];

const trigScenarios = [
  {
    scenarioId: 'trig-transfer-001',
    context: 'travel',
    transferLevel: 2,
    icon: '🚂',
    generate: () => {
      const opp = 10, adj = 10;
      const vars = { opp, adj };
      return {
        scenarioId: 'trig-transfer-001',
        context: 'travel',
        prompt: `A lighthouse is ${opp} meters high. If a ship is ${adj} meters away from the base, what is the angle of elevation of the top of the lighthouse in degrees from the ship?`,
        variables: vars,
        hints: [
          `The angle of elevation θ satisfies: tan(θ) = Opposite / Adjacent.`,
          `Opposite is the height (${opp}) and Adjacent is the distance (${adj}).`,
          `tan(θ) = ${opp} / ${adj} = 1. What angle has a tangent of 1?`
        ]
      };
    },
    evaluate: (vars) => 45,
    explanation: (vars) => `Step 1: Set up tangent ratio → tan(θ) = ${vars.opp} / ${vars.adj} = 1\nStep 2: Solve inverse tangent → θ = arctan(1) = 45°`,
    transferMapping: "Elevation angle vectors are calculated using standard inverse tangent trigonometric ratios."
  }
];

const variationScenarios = [
  {
    scenarioId: 'var-transfer-001',
    context: 'sports',
    transferLevel: 2,
    icon: '🏏',
    generate: () => {
      const force1 = 10, ext1 = 5;
      const force2 = 20;
      const vars = { force1, ext1, force2 };
      return {
        scenarioId: 'var-transfer-001',
        context: 'sports',
        prompt: `The extension of a training elastic band varies directly with the force applied. If a force of ${force1} N stretches it by ${ext1} cm, how many cm will a force of ${force2} N stretch it?`,
        variables: vars,
        hints: [
          `Direct variation means: Extension = k × Force.`,
          `Find variation constant k: ${ext1} / ${force1} = ${ext1 / force1}.`,
          `Multiply k by the new force of ${force2} N.`
        ]
      };
    },
    evaluate: (vars) => (vars.ext1 / vars.force1) * vars.force2,
    explanation: (vars) => `Step 1: Calculate direct variation constant k → ${vars.ext1} / ${vars.force1} = ${vars.ext1 / vars.force1}\nStep 2: Solve new extension → ${vars.ext1 / vars.force1} × ${vars.force2} = ${(vars.ext1 / vars.force1) * vars.force2} cm`,
    transferMapping: "Proportional variations map directly to constant coefficients in linear direct relations."
  }
];

const vectorsScenarios = [
  {
    scenarioId: 'vec-transfer-001',
    context: 'travel',
    transferLevel: 2,
    icon: '🚂',
    generate: () => {
      const x1 = 2, y1 = 3, x2 = 4, y2 = 5;
      const vars = { x1, y1, x2, y2 };
      return {
        scenarioId: 'vec-transfer-001',
        context: 'travel',
        prompt: `A hiker starts walking and has a first displacement vector A = [${x1}, ${y1}]. They then walk another displacement B = [${x2}, ${y2}]. What is their total combined displacement coordinates? (Submit as x, y)`,
        variables: vars,
        hints: [
          `To add displacement vectors, add their corresponding X and Y coordinates.`,
          `X total: ${x1} + ${x2}.`,
          `Y total: ${y1} + ${y2}.`
        ]
      };
    },
    evaluate: (vars) => `${vars.x1 + vars.x2}, ${vars.y1 + vars.y2}`,
    explanation: (vars) => `Step 1: Sum matching vector coordinates → [${vars.x1}+${vars.x2}, ${vars.y1}+${vars.y2}]\nStep 2: Find total displacement → ${vars.x1 + vars.x2}, ${vars.y1 + vars.y2}`,
    transferMapping: "Iterated physical displacements correspond to vector sum operations."
  }
];

const vocabScenarios = [
  {
    scenarioId: 'voc-transfer-001',
    context: 'travel',
    transferLevel: 2,
    icon: '🚂',
    generate: () => {
      const vars = {};
      return {
        scenarioId: 'voc-transfer-001',
        context: 'travel',
        prompt: `In urban planning, the geometric center of a city's region is referred to as which term? (Enter Centroid, Circumcenter, or Incenter)`,
        variables: vars,
        hints: [
          `The average position of all points in a shape is the centroid.`,
          `Centroid represents the physical center of gravity.`,
          `Type 'Centroid'.`
        ]
      };
    },
    evaluate: (vars) => 'Centroid',
    explanation: (vars) => `Step 1: Check description → Average geometric center is the Centroid.\nStep 2: Centroid`,
    transferMapping: "Spatial centering vocabulary maps directly to geometric centroid terminology."
  }
];

const guessScenarios = [
  {
    scenarioId: 'guess-transfer-001',
    context: 'pocketmoney',
    transferLevel: 2,
    icon: '🪙',
    generate: () => {
      const vars = {};
      return {
        scenarioId: 'guess-transfer-001',
        context: 'pocketmoney',
        prompt: `In a guessing game of numbers between 1 and 100, what is the maximum number of guesses needed to guarantee finding the correct number using binary search?`,
        variables: vars,
        hints: [
          `Binary search halves the search space each time.`,
          `We need to find smallest n such that 2^n >= 100.`,
          `Since 2^6 = 64 and 2^7 = 128, the answer is 7.`
        ]
      };
    },
    evaluate: (vars) => 7,
    explanation: (vars) => `Step 1: Model range using binary search → 2^n >= 100\nStep 2: Evaluate exponent → n = 7`,
    transferMapping: "Optimal search boundaries in ordered sets are calculated using base-2 logarithm bounds."
  }
];

module.exports = {
  percent: percentScenarios,
  ratio: ratioScenarios,
  fractionadd: fractionaddScenarios,
  addition: additionScenarios,
  decimals: decimalsScenarios,
  hcflcm: hcflcmScenarios,
  lineareq: lineareqScenarios,
  sdt: sdtScenarios,
  prob: probScenarios,
  mensur: mensurScenarios,
  quadratic: quadraticScenarios,
  matrix: matrixScenarios,
  angles: anglesScenarios,
  basicarith: basicarithScenarios,
  banking: bankingScenarios,
  bearings: bearingsScenarios,
  binomial: binomialScenarios,
  bounds: boundsScenarios,
  circmeasure: circmeasureScenarios,
  circleth: circlethScenarios,
  complex: complexScenarios,
  congruence: congruenceScenarios,
  conics: conicsScenarios,
  coordgeom: coordgeomScenarios,
  diff: diffScenarios,
  diffeq: diffeqScenarios,
  funceval: funcevalScenarios,
  gst: gstScenarios,
  indices: indicesScenarios,
  multiply: multiplyScenarios,
  primefactor: primefactorScenarios,
  profitloss: profitlossScenarios,
  pythag: pythagScenarios,
  remfactor: remfactorScenarios,
  rounding: roundingScenarios,
  section: sectionScenarios,
  sequences: sequencesScenarios,
  shares: sharesScenarios,
  sets: setsScenarios,
  similarity: similarityScenarios,
  squaring: squaringScenarios,
  simul: simulScenarios,
  stdform: stdformScenarios,
  stats: statsScenarios,
  surds: surdsScenarios,
  transform: transformScenarios,
  triangles: trianglesScenarios,
  trig: trigScenarios,
  variation: variationScenarios,
  vectors: vectorsScenarios,
  vocab: vocabScenarios,
  guess: guessScenarios,
  // Gym mappings for compatibility
  gymdecimals: decimalsScenarios,
  funcgym: funcevalScenarios,
  dotprodgym: matrixScenarios,
  fracaddgym: fractionaddScenarios,
  lineqgym: lineareqScenarios,
  indicesgym: indicesScenarios,
  polygym: quadraticScenarios,
  simplifyFraction
};
