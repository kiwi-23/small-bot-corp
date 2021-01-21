const Discord = require("discord.js");

const client1 = new Discord.Client();
client1.login("ODAxMTYxMTQ1MDQxMjg5MjE3.YAcpdQ.WoyB_SwkHGj-1pvbbbRKbM0SPLM");

const client2 = new Discord.Client();
client2.login("ODAxMjA3OTAzNzM4Mzk2Njkz.YAdVAQ.wUf4OcmCT902-NgJBhcM1TUbyTA");

const client3 = new Discord.Client();
client3.login("ODAxMjA0MDU5MjU5Nzk3NTI0.YAdRbQ.1Jm0CmEplLDfZM6KnTXEMvLcE5M");

var general_id = "801163601599004683";
var log1_id = "801201647569207306";
var log2_id = "801205110121431081";
var log3_id = "801205134935064596";
var print_id = "801540566952312843";

var bot1_log1, bot2_log2, bot3_log3;
var bot1_print, bot2_print, bot3_print;

client1.on("ready", function() {
  bot1_log1 = client1.channels.cache.get(log1_id);
  bot1_print = client1.channels.cache.get(print_id);
  console.log("bot 1 ready!");
});

client2.on("ready", function() {
  bot2_log2 = client2.channels.cache.get(log2_id);
  bot2_print = client2.channels.cache.get(print_id);
  console.log("bot 2 ready!");
});

client3.on("ready", function() {
  bot3_log3 = client3.channels.cache.get(log3_id);
  bot3_print = client3.channels.cache.get(print_id);
  console.log("bot 3 ready!");
});


var text = "The greatest improvement in the productive powers of labour, and the greater part of the skill, dexterity, and judgment with which it is any where directed, or applied, seem to have been the effects of the division of labour";
var words = text.toLowerCase().replace(/,/g, "").split(" ");
var index = 0;

var target = "";
var number = 500;
var mutation = 0.01;

var population = [];
var pool = [];
var generations = 0;
var best;
var finished = false;

client1.on("message", function(message) {
  if ((message.channel.id === print_id && index < words.length) || (message.channel.id === general_id && message.author.username === "mango" && message.content === "minions !begin")) {
    begin();
    fitness();
    if (finished)
      bot1_print.send(best);
    else {
      selection();
      generate();
      bot1_log1.send(best);
    }
  }
  else if (message.channel.id === log3_id) {
    fitness();
    if (finished)
      bot1_print.send(best);
    else {
      selection();
      generate();
      bot1_log1.send(best);
    }
  }
});

client2.on("message", function(message) {
  if (message.channel.id === log1_id) {
    fitness();
    if (finished)
      bot2_print.send(best);
    else {
      selection();
      generate();
      bot2_log2.send(best);
    }
  }
});

client3.on("message", function(message) {
  if (message.channel.id === log2_id) {
    fitness();
    if (finished)
      bot3_print.send(best);
    else {
      selection();
      generate();
      bot3_log3.send(best);
    }
  }
});

function begin() {
  finished = false;
  target = words[index];
  index++;
  for (let i = 0; i < number; i++) {
    population[i] = {};
    population[i].genes = [];
    population[i].fitness = 0;
    for (let j = 0; j < target.length; j++) {
      let c = Math.floor(Math.random() * 27) + 96;
      if (c === 96)
        c = 44;
      population[i].genes[j] = String.fromCharCode(c);
    }
  }
}

function fitness() {
  for (let i = 0; i < population.length; i++) {
    let score = 0;
    for (let j = 0; j < population[i].genes.length; j++) {
      if (population[i].genes[j] == target.charAt(j))
        score++;
    }
    population[i].fitness = score / target.length;
  }
  evaluate();
}

function evaluate() {
  let record = 0.0;
  let record_i = 0;
  for (let i = 0; i < population.length; i++) {
    if (population[i].fitness > record) {
      record_i = i;
      record = population[i].fitness;
    }
  }
  best = population[record_i].genes.join("");
  console.log(best);
  if (best === target)
    finished = true;
}

function selection() {
  pool = [];
  let maximum = 0;
  for (let i = 0; i < population.length; i++) {
    if (population[i].fitness > maximum)
      maximum = population[i].fitness;
  }
  for (let i = 0; i < population.length; i++) {
    let n = (population[i].fitness / maximum) * 100;
    for (let j = 0; j < n; j++) {
      pool.push(population[i]);
    }
  }
}

function generate() {
  for (let i = 0; i < population.length; i++) {
    let parent1 = pool[Math.floor(Math.random() * pool.length)];
    let parent2 = pool[Math.floor(Math.random() * pool.length)];
    let child = crossover(parent1, parent2);
    mutate(child);
    population[i] = child;
  }
  generations++;
}

function crossover(parent1, parent2) {
  let child = {};
  child.genes = [];
  child.genes.length = target.length;
  child.fitness = 0;
  let midpoint = Math.floor(Math.random() * child.genes.length);
  for (let i = 0; i < child.genes.length; i++) {
    if (i > midpoint)
      child.genes[i] = parent1.genes[i];
    else
      child.genes[i] = parent2.genes[i];
  }
  return child;
}

function mutate(child) {
  for (let i = 0; i < child.genes.length; i++) {
    if (Math.random(1) < mutation) {
      let c = Math.floor(Math.random() * 27) + 96;
      if (c === 96)
        c = 44;
      child.genes[i] = String.fromCharCode(c);
    }
  }
}
