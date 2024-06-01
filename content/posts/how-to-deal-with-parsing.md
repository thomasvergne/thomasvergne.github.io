+++
title = 'Gérer simplement le parsing dans son langage'
date = 2024-03-03T17:38:41+01:00
draft = false
description = "Le parsing est souvent une étape qui à tort peut arrêter nombreux de novices dans leur quête de création de langage. Pourtant, il existe des solutions simples et toutefois efficaces pour gérer cette étape."
author = "Thomas Vergne"
tags = ["programmation fonctionnelle", "monades", "parser combinators", "parsers"]
+++

Le domaine des langages et des compilateurs est un domaine formidable de l'informatique. Tellement vaste et complexe qu'il peut en effrayer plus d'un. Jusqu'à parfois en arrêter certains aux premières étapes de la création d'un langage. Parmi ces étapes, le parsing est souvent celle qui pose le plus de problèmes. Pourtant, il existe des solutions simples et toutefois efficaces pour gérer cette étape. Parmi elles, les *parser combinators*.

# Qu'est-ce qu'un *parser combinator* ?

Un combinateur d'analyseurs (ou *parser combinator* parce que c'est plus simple !) est une technique de parsing utilisée surtout dans les langages fonctionnels comme Haskell qui supportent un brin au minimum d'évaluation paresseuse. L'idée résulte dans le fait de **combiner** des **parsers** entre eux afin d'en obtenir un plus complexe. Cela permet de construire des parsers de manière modulaire et de les réutiliser facilement.

En pratique, cette technique peut avoir ses faiblesses. Effectivement, combiner des parsers et donc potentiellement parfois des fonctions récursives, ça peut avoir un coût plus ou moins important et élevé. Selon les besoins et les cas d'utilisation, il peut être préférable de se tourner vers des outils plus performants et optimisés, mais souvent plus complexes à mettre en place.

L'implémentation des *parsers combinators* est généralement simple une fois que le concept a été compris.

# Description d'un *parser combinator*

Un combinateur de parsers peut se résumer à une fonction polymorphique qui prend en entrée un *input* (souvent une chaîne de caractères) et retourne un *output* (souvent une structure de données représentant le résultat du parsing) ainsi que le reste de l'*input* non consommé. 

Pour faire plus simple, c'est une façon d'avancer pas à pas comme le ferait un lexer mais avec la puissance que permet d'obtenir les parsers. 

## Implémentation non-exhaustive

Pour procéder à l'implémentation de ces parsers, on va tout d'abord convenir de procéder comme le feraient ces parsers, étape par étape. Dans un premier temps, on ne va définir qu'un type pour davantage se représenter le concept.

```haskell
type Parser a = String -> (Either String a, String)
```

> Note: Ici, on utilise un type `Either String a` pour représenter le résultat du parsing. `Left` sera utilisé pour représenter une erreur et `Right` pour représenter un succès.

Voici donc l'unique type pouvant représenter l'intégralité des parsers de notre bibliothèque. Afin d'avoir un aperçu dans un autre langage du rendu que pourrait avoir ce type, le voici:

```typescript
type Either<A, B> = { left: A } | { right: B }
type Parser<A> = (input: string) => [Either<string, A>, string]
```

### Quelques fonctions importantes

C'est bien beau d'avoir notre type, mais maintenant, il faut pouvoir opérer dessus facilement afin de pouvoir commencer à construire nos premiers parsers. Pour cela, nous allons écrire les instances de [`Functor`, `Applicative`, `Monad` et `Alternative` pour notre type `Parser`](https://thomas-vergne.fr/posts/get-started-with-haskell/#la-programmation-monadique).

```haskell
instance Functor Parser where
  fmap :: (a -> b) -> Parser a -> Parser b
  fmap f p = ???
```

Que faire ici ? Cette instance nous demande déjà un peu de gymnastique au niveau des types pour comprendre que faire et quoi insérer. Pour nous simplifier la tâche, faisons l'étape inverse de l'étape précédente, c'est-à-dire dérouler le type `Parser` pour comprendre ce qu'il contient.

```haskell
fmap :: (a -> b) -> Parser a -> Parser b
-- On déroule le type Parser
fmap 
  :: (a -> b) 
  -> (String -> (Either String a, String)) 
  -> (String -> (Either String b, String))
```

On remarque donc à nouveau notre `f` et notre `p` qui sont respectivement `(a -> b)` et `(String -> (Either String a, String))`. Ce qu'il faut remarquer là, c'est un détail de syntaxe de Haskell. En réalité le dernier type de notre fonction `fmap` est une fonction, ce qui veut dire dans ce cas que l'on peut supprimer les parenthèses et obtenir un résultat identique. 

```haskell
fmap :: (a -> b) -> Parser a -> Parser b
-- On supprime les parenthèses
fmap 
  :: (a -> b) 
  -> (String -> (Either String a, String))
  -> String 
  -> (Either String b, String)
```

On se retrouve désormais avec un nouvel argument de type `String` qu'on appelera `input`. Ainsi, l'instance de `Functor` consiste désormais à appliquer la fonction `f` sur le résultat du parsing de `p` et à retourner le résultat de cette application.

```haskell
instance Functor Parser where
  fmap :: (a -> b) -> Parser a -> Parser b
  fmap f p input = case p input of
    (Left err, rest) -> (Left err, rest)
    (Right a, rest) -> (Right (f a), rest)
```

On peut maintenant répéter cette opération pour les instances de `Applicative`, `Monad` et `Alternative` pour notre type `Parser`.

```haskell
instance Applicative Parser where
  pure :: a -> Parser a
  pure a = ???
  (<*>) :: Parser (a -> b) -> Parser a -> Parser b
  p1 <*> p2 = ???

instance Monad Parser where
  (>>=) :: Parser a -> (a -> Parser b) -> Parser b
  p >>= f = ???

instance Alternative Parser where
  empty :: Parser a
  empty = ???

  (<|>) :: Parser a -> Parser a -> Parser a
  p1 <|> p2 = ???
```

La fonction `pure` ici ne sert qu'à imbriquer une valeur dans notre type `Parser` afin de pouvoir retourner des valeurs à la façon d'un langage impératif. La fonction `<*>` quant à elle permet d'appliquer une fonction contenue dans un `Parser` à une valeur contenue dans un autre `Parser`. Enfin, la fonction `>>=` permet de chaîner des parsers entre eux. La fonction `empty` permet de retourner un parser vide et la fonction `<|>` permet de combiner deux parsers entre eux, à la façon d'un opérateur booléen `or`.

```haskell
instance Applicative Parser where
  pure :: a -> Parser a
  pure a input = (Right a, input)

  (<*>) :: Parser (a -> b) -> Parser a -> Parser b
  p1 <*> p2 input = case p1 input of
    -- ^ On exécute toujours le premier parser
    (Left err, rest) -> (Left err, rest)
    -- ^ Si le premier parser échoue, on retourne l'erreur
    (Right f, rest) -> case p2 rest of
    -- ^ Sinon, on exécute le second parser
      (Left err, rest') -> (Left err, rest')
      (Right a, rest') -> (Right (f a), rest')
    -- ^ Si le second parser échoue, on retourne l'erreur, sinon on applique la fonction f obtenue à l'issue du premier parser sur la valeur a obtenue à l'issue du second parser

instance Monad Parser where
  (>>=) :: Parser a -> (a -> Parser b) -> Parser b
  p >>= f input = case p input of
    -- ^ On exécute toujours le premier parser
    (Left err, rest) -> (Left err, rest)
    -- ^ Si le premier parser échoue, on retourne l'erreur
    (Right a, rest) -> f a rest
    -- ^ Sinon, on applique la fonction f sur la valeur a obtenue à l'issue du premier parser et sur le reste de l'input

instance Alternative Parser where
  empty :: Parser a
  empty _ = (Left "Empty parser", [])

  (<|>) :: Parser a -> Parser a -> Parser a
  p1 <|> p2 input = case p1 input of
    (Left _, _) -> p2 input
    (Right a, rest) -> (Right a, rest)
```

Ces quatre instances qui pour certains peuvent paraître anecdotiques sont en réalité cruciales pour la suite de l'implémentation de notre bibliothèque de *parser combinators*. Elles permettent de manipuler les parsers de manière plus aisée notamment en permettant un style de programmation plus naturel et plus impératif.

### Fonctions de base pour les parsers

La première étape d'un parser, la plus profonde, c'est d'avancer pas à pas sur l'*input*. Pour ce faire, on a besoin d'une fonction qui récolte le premier caractère de l'*input* et le reste de l'*input* et qui retourne ce caractère et le reste de l'*input*.

Appelons cette fonction `item`.

```haskell
item :: Parser Char
item input = case input of
  [] -> (Left "Empty input", [])
  (x:xs) -> (Right x, xs)
```

Cette fonction est sympatique, mais elle ne nous permet pas de faire grand chose. En effet, elle ne nous permet que de récupérer le premier caractère de l'*input*. Pour pouvoir faire plus, il nous faut une fonction qui nous permette de filtrer les caractères de l'*input*.

Appelons cette fonction `satisfy`. Le comportement de `satisfy` va être relativement simple et similaire à celui de `item` à une différence près. On ne va retourner le caractère que si une condition, au préalable fournie par l'utilisateur, est pleinement remplie.

```hs
satisfy :: (Char -> Bool) -> Parser Char
satisfy f input = case input of
  [] -> (Left "Empty input", [])
  (x:xs)
    | f x = (Right x, xs)
    | otherwise = (Left "Unexpected character", input)
```

Maintenant, on est content de pouvoir faire cela, mais on aimerait pouvoir consommer des élément plus complexes, comme des mots. Il va nous falloir quelque chose qui itère cette fonction `satisfy` sur plusieurs caractères tant que c'est possible. Appelons cette fonction `string`: 

```hs
string :: String -> Parser String
string _ [] = (Left "Empty input", [])
string (x:xs) (i:nput) 
  | x == i = string xs nput
  | otheriwse = (Right "Unexpected character", i:nput)
```

Désormais, permettons-nous un peu de repos au niveau des implémentations pour un peu profiter de ce que l'on a créé. Testons nos diverses fonctions et nos divers parsers à travers des exemples simples :

J'aimerais pouvoir vérifier si un utilisateur dit bien bonjour et non bonsoir:
```hs
aDitBonjour :: Parser Bool
aDitBonjour = do
  xs <- string "bonjour" <|> string "bonsoir"
  return (xs == "bonjour")
```

Cette fonction devrait fonctionner, et pourtant elle ne fonctionne pas. Si l'utilisateur inscrit "bonsoir", le parser retournera une erreur comme quoi le caractère est inattendu. Pourquoi ? Parce que notre parser `string` consomme les caractères qu'il a déjà consommé, donc une fois qu'il a consommé `bon`, il tente de consommer `jour`. Problème, l'utilisateur a entré "bonsoir" et non "bonjour". Le parser s'attend à recevoir un "j" mais reçoit un "s" à la place, il retourne donc une erreur.

Pour palier dans un premier temps à ce problème, on va modifier légèrement notre fonction `aDitBonjour` pour la rendre plus souple:

```hs
aDitBonjour :: Parser Bool
aDitBonjour = do
  string "bon"
  xs <- string "jour" <|> string "soir"
  return (xs == "jour")
```

Cette fois-ci, normalement, tout parse bien, et pour cause, on vérifie dans un premier temps que l'utilisateur a bien écrit "bon" avant de vérifier s'il a écrit "jour" ou "soir". Vu que "jour" et "soir" n'ont rien en commun au tout début, il n'y a aucun risque de collision.

### Des examples de parsers

Dans des véritables langages, on peut retrouver parfois des parsers qui sont plus complexes. Par exemple un parser pour les variables :

```hs
variable :: Parser String
variable = do
  x <- letter
  xs <- many (letter <|> digit)
  return (x:xs)
```

Ce parser permet de parser une variable qui respecte la règle regex suivante :

```js
/[a-zA-Z][a-zA-Z0-9]*/
```

## Exercices d'implémentation

Afin de vous permettre de vous exercer à l'implémentation de *parser combinators*, je vous propose quelques fonctions à implémenter :

1. `char :: Char -> Parser Char` : Cette fonction doit retourner un parser qui consomme un caractère si ce caractère est égal au caractère passé en argument.
2. `digit :: Parser Char` : Cette fonction doit retourner un parser qui consomme un caractère si ce caractère est un chiffre.
3. `letter :: Parser Char` : Cette fonction doit retourner un parser qui consomme un caractère si ce caractère est une lettre.
4. `space :: Parser Char` : Cette fonction doit retourner un parser qui consomme un caractère si ce caractère est un espace.
5. `many :: Parser a -> Parser [a]` : Cette fonction doit retourner un parser qui consomme un nombre indéfini de fois le parser passé en argument.
6. `sepBy :: Parser a -> Parser sep -> Parser [a]` : Cette fonction doit retourner un parser qui consomme un nombre indéfini de fois le premier parser passé en argument séparé par le second parser passé en argument.
7. `try :: Parser a -> Parser a` : Cette fonction doit retourner un parser qui tente de parser le parser passé en argument et qui retourne une erreur si le parser échoue, mais avec l'*input* inchangé.
8. `between :: Parser open -> Parser close -> Parser a -> Parser a` : Cette fonction doit retourner un parser qui consomme le premier parser passé en argument, puis le parser passé en argument, puis le second parser passé en argument.


Et plein d'autres fonctions qui varieront selon vos besoins...

Notre implémentation des parsers reste certes très basique mais permet d'écrire simplement et rapidement des parsers plus ou moins complexes. On pourrait enrichir bien évidemment ce parser en ajoutant notamment des fonctionnalités pour supporter des opérations d'IO (notamment en Haskell via les monad transformers), ou encore supporter le traçage des positions...