---
title: "Une machine virtuelle, comment ça marche ?"
pubDate: '2024-10-21'
description: 'Découvrez comment implémenter votre propre interpréteur de bytecode en Typescript.'
heroImage: '/articles/virtual-machine.png'
tags: ['vm', 'typescript', 'interpréteur']
---

Une machine virtuelle (VM) est un programme qui simule le comportement d'un ordinateur. Elle permet d'exécuter du code binaire, appelé bytecode, sur n'importe quelle machine, indépendamment de son architecture. Les machines virtuelles sont utilisées dans de nombreux domaines, tels que l'**émulation de systèmes d'exploitation**, ou encore pour certains **langages de programmation** comme Java ou Python. 

Oui ! Vous avez bien lu, **Python n'est pas vraiment uniquement un langage interprété**, mais un langage compilé qui utilise une machine virtuelle pour exécuter son code.

## Comment ça marche une VM ? 

Une VM fonctionne généralement en plusieurs étapes : 

1. **Le code source** est compilé en **bytecode**. Le bytecode est un code binaire intermédiaire, plus proche du langage machine que du code source. Il est généralement plus facile à interpréter qu'un code source, car il est plus simple et plus compact.
2. La VM initialise ensuite les principales variables globales, qu'on appellera registres, et **déchiffre le bytecode** pour l'exécuter.
3. La VM **interprète** le bytecode, c'est-à-dire qu'elle exécute les instructions une par une, en modifiant les registres en permanence. Le tout est exécuté dans une boucle infinie, jusqu'à ce que le programme se termine.

## Notre set d'instructions

Toute VM qui se respecte dispose d'un set d'instruction qu'elle exécute. Par exemple pour Python, vous le retrouverez [ici](https://docs.python.org/3/library/dis.html), et pour Java [là](https://docs.oracle.com/javase/specs/jvms/se7/html/jvms-6.html).

Pour notre VM, nous allons définir quelques opérations simples dans un premier temps : 

- `HALT` arrête le programme
- `LOAD_CONSTANT i` charge la constante à l'index `i` dans la stack
- `ADD` additionne les deux dernières valeurs de la stack
- `JUMP_IF_FALSE_BY i` ajoute `i` à l'index de l'instruction si la dernière valeur de la stack est fausse
- `PRINT` affiche la dernière valeur de la stack
- `STORE_GLOBAL i` stocke la dernière valeur de la stack dans la variable globale à l'index `i`
- `LOAD_GLOBAL i` charge la variable globale à l'index `i` dans la stack
- `COMPARE op` compare les deux dernières valeurs de la stack avec l'opérateur `op` (par exemple `==`, `!=`, `>`, `<`, etc.)

Ainsi notre premier programme sera le suivant :

```typescript
let x = 10
let y = x == 10 ? 20 : 30

print(y)
```

Un programme qui paraît si simple, mais qui n'est pas si court que cela une fois traduit dans notre set d'instructions :

```haskell
LOAD_CONSTANT 0    -- charge la constante 10 dans la stack
STORE_GLOBAL 0     -- stocke la valeur de la stack dans la variable globale 0 (x)

LOAD_GLOBAL 0      -- charge la variable globale 0 (x) dans la stack
LOAD_CONSTANT 0    -- charge la constante 10 dans la stack
COMPARE "=="       -- compare les deux dernières valeurs de la stack
JUMP_IF_FALSE_BY 2 -- saute à l'instruction 2 si x n'est pas égal à 10
LOAD_CONSTANT 1    -- charge la constante 20 dans la stack
LOAD_CONSTANT 2    -- charge la constante 30 dans la stack
STORE_GLOBAL 1     -- stocke la valeur de la stack dans la variable globale 1 (y)

LOAD_GLOBAL 1      -- charge la variable globale 1 dans la stack
PRINT              -- affiche la dernière valeur de la stack, dans ce cas, y

HALT               -- arrête le programme
```

## Implémentation en Typescript

Dans un premier temps, nous allons définir nos besoins et nos attentes. Pour exécuter notre programme, nous avons besoin d'une VM. C'est-à-dire :

- Une boucle infinie
- Une stack pour stocker nos valeurs de bas en haut
- Un registre `pc` *(program counter)* qui pointe vers l'instruction actuelle
- Un registre `bp` *(base pointer)* qui pointe vers le début de la stack 
- Un registre `sp` *(stack pointer)* qui pointe vers le sommet de la stack

À partir de ces informations, nous avons toute la ligne directrice pour implémenter notre machine virtuelle. Commençons par définir nos registres et notre stack.

### Les registres et la stack

```typescript
type Register = number
type Stack = number[]

interface VM {
  pc: Register
  bp: Register
  sp: Register
  stack: Stack
}

const createVM = (): VM => ({
  pc: 0,
  bp: 16,
  sp: 16,
  stack: new Array(256).fill(0)
})
```

Nous avons défini ici `bp` par défaut à 16 afin de laisser de la place pour stocker les variables globales. Ainsi, cet espace entre 0 et 16 sera strictement réservé aux variables globales.

Nous allons ensuite définir quelques opérations sur la stack. Dans notre cas, nous avons uniquement besoin de `push` et `pop`.

```ts
function push(vm: VM, value: number) {
  if (vm.sp >= vm.stack.length) {
    throw new Error('Stack overflow')
  }
  
  vm.stack[vm.sp++] = value
}

function pop(vm: VM): number {
  if (vm.sp <= vm.bp) {
    throw new Error('Stack underflow')
  }
  
  return vm.stack[--vm.sp]
}
```

### La boucle d'exécution 

Nous allons dès-à-présent implémenter notre boucle d'exécution. C'est ici que nous allons définir la logique de nos opérations.

### La boucle d'exécution

Dans notre boucle d'exécution, nous allons récupérer l'instruction et l'opérande à l'index `pc` et `pc + 1`, puis exécuter l'instruction correspondante. Nous allons répéter cette opération jusqu'à ce que `halted` soit `true`.

```ts
const instruction = instructions[vm.pc];
const operand = instructions[vm.pc + 1];
```

### Les instructions

Dans un premier temps, nous allons définir une variable `halted` qui va contenir l'état d'exécution du programme. C'est cette variable qui décide si notre programme continue de tourner ou non.

#### HALT

L'instruction `HALT` arrête le programme. Pour cela, nous allons simplement définir `halted` à `true` : 

```ts
case 0x00: // HALT
  halted = true;
  break;
```

Comme vous pouvez aussi le voir, nous encodons nos instructions en hexadécimal. Cela nous permet de les stocker dans un tableau de nombres, ce qui est plus compact et plus rapide à exécuter, plutôt que d'utliliser un objet ou une chaîne de caractère.

#### LOAD_CONSTANT

L'instruction `LOAD_CONSTANT` charge une constante dans la stack. Pour cela, nous allons simplement appeler la fonction `push` avec la constante à l'index `operand` : 

```ts
case 0x01: // LOAD_CONSTANT
  push(vm, constants[operand]);
  vm.pc += 2;
  break;
```

#### ADD

L'instruction `ADD` additionne les deux dernières valeurs de la stack. Pour cela, nous allons simplement appeler la fonction `push` avec la somme des deux dernières valeurs de la stack : 

```ts
case 0x02: // ADD
  push(vm, pop(vm) + pop(vm));
  vm.pc += 2;
  break;
```

#### JUMP_IF_FALSE_BY

L'instruction `JUMP_IF_FALSE_BY` saute à l'instruction `operand` si la dernière valeur de la stack est fausse. Pour cela, nous allons simplement vérifier si la dernière valeur de la stack est égale à 0, et si c'est le cas, ajouter `operand` à `pc` : 

```ts
case 0x03: // JUMP_IF_FALSE_BY
  if (pop(vm) === 0) {
    vm.pc += operand;
  } else {
    vm.pc += 2;
  }
  break;
```

#### PRINT

L'instruction `PRINT` affiche la dernière valeur de la stack. Pour cela, nous allons simplement appeler `console.log` avec la dernière valeur de la stack : 

```ts
case 0x04: // PRINT
  console.log(pop(vm));
  vm.pc += 2;
  break;
```

#### STORE_GLOBAL

L'instruction `STORE_GLOBAL` stocke la dernière valeur de la stack dans la variable globale à l'index `operand`. Pour cela, nous allons simplement stocker la dernière valeur de la stack dans la variable globale à l'index `operand` : 

```ts
case 0x05: // STORE_GLOBAL
  vm.stack[operand] = pop(vm);
  vm.pc += 2;
  break;
```

#### LOAD_GLOBAL

L'instruction `LOAD_GLOBAL` charge la variable globale à l'index `operand` dans la stack. Pour cela, nous allons simplement charger la variable globale à l'index `operand` dans la stack : 

```ts
case 0x06: // LOAD_GLOBAL
  push(vm, vm.stack[operand]);
  vm.pc += 2;
  break;
```

#### COMPARE

L'instruction `COMPARE` compare les deux dernières valeurs de la stack avec l'opérateur `operand`. Pour cela, nous allons simplement comparer les deux dernières valeurs de la stack avec l'opérateur `operand` et stocker le résultat dans la stack : 

```ts
case 0x07: // COMPARE
  const b = pop(vm);
  const a = pop(vm);
  let result = 0;

  switch (operand) {
    case '==':
      result = a === b ? 1 : 0;
      break;
    case '!=':
      result = a !== b ? 1 : 0;
      break;
    case '>':
      result = a > b ? 1 : 0;
      break;
    case '<':
      result = a < b ? 1 : 0;
      break;
    case '>=':
      result = a >= b ? 1 : 0;
      break;
    case '<=':
      result = a <= b ? 1 : 0;
      break;
  }

  push(vm, result);
  vm.pc += 2;
  break;
```

### Un cas par défaut

Enfin, nous allons définir un cas par défaut pour gérer les instructions inconnues : 

```ts
default:
  throw new Error(`Unknown instruction: ${instruction}`);
```

### Notre programme 

Il est temps maintenant de convertir notre programme initial en bytecode et de l'exécuter. Pour cela, nous allons définir nos constantes et nos instructions : 

```ts
const constants = [10, 20, 30];

const instructions = [
  0x01, 0x00, // LOAD_CONSTANT 0
  0x05, 0x00, // STORE_GLOBAL 0
  0x06, 0x00, // LOAD_GLOBAL 0
  0x01, 0x00, // LOAD_CONSTANT 0
  0x07, 0x00, // COMPARE "=="
  0x03, 0x02, // JUMP_IF_FALSE_BY 2
  0x01, 0x01, // LOAD_CONSTANT 1
  0x01, 0x02, // LOAD_CONSTANT 2
  0x05, 0x01, // STORE_GLOBAL 1
  0x06, 0x01, // LOAD_GLOBAL 1
  0x04, 0x00, // PRINT
  0x00, 0x00, // HALT
];
```

## Lien entre les fonctions, le *bp*, le *sp* et le *pc*

Il est important de comprendre comment les fonctions, le *bp*, le *sp* et le *pc* sont liés entre eux. En général, dans un compilateur, on a une passe que l'on nomme la *closure conversion*. Elle vise à transformer toutes les fonctions anonymes en fonctions nommées et au passage, à transformer les variables locales en variables globales.

Cette passe a pour but d'optimiser la représentation des fonctions pour plus tard les implémenter plus facilement notamment dans une machine virtuelle.

Comment donc fonctionne une fonction dans une VM ? Pour cela nous allons définir une instruction temporairement `MAKE_AND_STORE_FUNCTION i j` où `i` représente le nombre de variables locales et `j` le nombre d'instructions de la fonction.

Lors de l'exécution de cette instruction, nous allons :
1. Créer une nouvelle valeur qui contient l'adresse de la première instruction de la fonction, ainsi que le nombre de variables locales.
2. Stocker cette valeur dans la variable globale à l'index `operand`.
3. Augmenter le *pc* de `j`.

Il nous faut cependant une autre instruction pour appeler une fonction. Nous allons donc définir l'instruction `CALL_FUNCTION i` où `i` représente l'index de la fonction à appeler.

Lors de l'exécution de cette instruction, nous allons :
1. Extraire de notre valeur de fonction, le nombre de variables locales et l'adresse de la première instruction.
2. Définir un nouvel *stack pointer* `new_sp` qui pointe vers le sommet de la stack, sans les arguments de l'appel de la fonction.
3. Modifer le `sp` pour inclure l'espace des variables locales potentielles.
4. Ajouter une nouvelle frame de fonction dans la stack, qui contient le *bp* actuel, le *pc* qui correspond à l'instruction à exécuter après la fonction, et le *sp* qui correspond à `new_sp`.
5. Mettre à jour le *bp* pour pointer vers le début de la frame de la fonction.
6. Incrément une variable `callstack` de 1. Cette variable permet de savoir combien de fonctions sont actuellement en cours d'exécution.
7. Modifier le *pc* pour pointer vers la première instruction de la fonction.

Avec ces deux instructions, nous avons maintenant un moyen de gérer les fonctions dans notre VM.

## Conclusion

Il est temps maintenant de tester notre VM, et de voir si notre programme fonctionne correctement. Pour cela, nous allons simplement appeler notre fonction `run` avec notre VM, nos instructions, nos constantes et nos variables globales : 

```ts
const vm = createVM();

run(vm, instructions, constants);
```

Et voilà ! Vous avez implémenté votre propre machine virtuelle en Typescript. Vous pouvez maintenant exécuter n'importe quel programme en bytecode sur n'importe quelle machine, indépendamment de son architecture. Vous pouvez également ajouter de nouvelles instructions, de nouvelles opérations, ou encore de nouvelles fonctionnalités à votre VM. Les possibilités sont infinies !