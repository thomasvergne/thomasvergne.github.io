---
title: "Bonzai"
pubDate: '2024-10-21'
description: 'Découvrez ce nouveau langage de programmation mêlant programmation par acteur et programmation réactive'
heroImage: '/articles/bonzai.png'
tags: ['pinned', 'projet']
---

Bonzai est un langage de programmation hautement concurrent qui mêle les concepts de **programmation par acteur** et de **programmation réactive**. Il a été créé dans le but de simplifier la programmation concurrente et de permettre aux développeurs de créer des applications réactives plus facilement.

Il a été pensé pour être simple d'utilisation, tout en offrant des fonctionnalités avancées. Ainsi, le langage est [compilé-interprété](#le-modèle-compilé-interprété). Il est designé pour être à la fois tolérant aux erreurs mais intolérant à d'autres, afin de garantir une certaine qualité de code. De ce fait, les erreurs de type sont détectées à la compilation, mais les erreurs de logique ne le sont pas.

## Programmation par acteur

La programmation par acteur permet à Bonzai de gérer la concurrence de manière simple mais efficace. Chaque acteur est une entité indépendante qui communique avec les autres acteurs par des messages. Ainsi, les acteurs peuvent s'exécuter en parallèle, ce qui permet de créer des applications hautement concurrentes.

Voici un exemple d'acteur en Bonzai : 

```Bonzai
interface Greeter {
  fn sayTo(name: string)
}

actor Greeter < Greeter {
  on sayTo(name) => {
    print("Hello, $name!")
  }
}

let greeter = spawn Greeter

greeter->sayTo("World")
```

Dans cet exemple ci-dessus, nous créons un acteur `Greeter` qui implémente l'interface `Greeter`. L'acteur `Greeter` a une méthode `sayTo` qui prend un argument `name` de type `string`. Lorsque l'acteur reçoit un message `sayTo`, il imprime "Hello, $name!".

**Chaque acteur doit implémenter une interface.**

Les acteurs sont codées de façon [*first-class*](#les-acteurs-en-tant-quexpression-first-class-actors), ce qui signifie qu'ils peuvent être passés en tant qu'arguments à d'autres acteurs, stockés dans des variables, et retournés par des fonctions. Nous verrons plus tard quel est l'intérêt de cette fonctionnalité.

## Programmation réactive

La programmation réactive permet à Bonzai de faire réagir une variable à la modification de son environnement. Ainsi une variable qui utilise une autre variable réactive sera automatiquement mise à jour lorsque la variable source change :

```bonzai
live x = "World"

let msg = "Hello, $x!"

print(msg) // Affiche "Hello, World!"

x = "Bonzai"

print(msg) // Affiche "Hello, Bonzai!"
```

Cette fonctionnalité peut être couplée aux acteurs pour donner lieu à des applications réactuves plus poussées. Par exemple, on peut lier une variable à un évènement, via l'acteur `Reactive` :

```bonzai
let r = spawn Reactive("Hello", fn(var) => {
  print("Hello, " + var.value + "!")
})

r %= "user" // Affiche "Hello, user!"

r %= "world" // Affiche "Hello, world!"
```

Dans cet exemple, nous créons un acteur `Reactive` qui prend une valeur initiale et une fonction de callback. Lorsque la valeur de l'acteur change, la fonction de callback est appelée.

## Les acteurs en tant qu'expression *(first-class actors)*

Les acteurs peuvent être passés en tant qu'arguments à d'autres acteurs, stockés dans des variables, et retournés par des fonctions. Cela permet de créer des applications hautement modulaires et réutilisables.

Composer des fonctions avec des acteurs permet surtout de donner lieu à des acteurs avec des environnements externes. Par exemple, créons un compteur avec un acteur :

```bonzai
interface Counter {
  fn increment()
}

fn Counter() => {
  mut counter = 0

  actor < Counter {
    on increment() => {
      counter += 1
      print(counter.value)
    }
  }
}
```

Cette fonction définie un acteur qui implémente l'interface `Counter`. On initialise le compteur dans la fonction et on met à jour le compteur dans l'acteur. Ainsi on peut faire muter des variables dans les acteurs :

```bonzai
let counter = spawn Counter()

counter->increment() // Affiche 1
counter->increment() // Affiche 2
counter->increment() // Affiche 3
```

## Le modèle compilé-interprété

Bonzai est un langage dit compilé-interprété. Pourquoi ? Parce que le langage est tout d'abord compilé et optimisé via tout un tas de passes du compilateur, pour finalement devenir une sorte de **fichier binaire** qui représente toutes les instructions du programme de façon linéaire. Ce qu'on appelle plus communément un *bytecode*.

Ensuite, ce bytecode a besoin d'être interprété, c'est là que vient la deuxième phase avec la **machine virtuelle**. La machine virtuelle va lire ce fichier bytecode et en extraire chacune des instructions pour les interpréter une à une.

Ce modèle permet en général de combiner la flexibilité de l'interprétation avec la performance de la compilation. C'est un modèle qui a fait ses preuves dans d'autres langages comme Java, Python ou encore Javascript.

![Modèle compilation-interprétation](/articles/bonzai/compilation.svg)

## Conclusion

Bonzai est un langage de programmation hautement concurrent qui mêle les concepts de programmation par acteur et de programmation réactive. Il a été créé dans le but de simplifier la programmation concurrente et de permettre aux développeurs de créer des applications réactives plus facilement.

Le langage est encore en développement, mais a de grandes ambitions concernant ses fonctionnalités et applications. Vous pouvez suivre le projet sur [GitHub](https://github.com/thomasvergne/bonzai).