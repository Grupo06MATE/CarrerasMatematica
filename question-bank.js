const QUESTION_BANK = [
  {
    id: "N1-001",
    level: 1,
    topic: "polinomio_caracteristico",
    difficulty: "facil",
    question: "Sea A = [[2,1],[0,3]]. Cual es el polinomio caracteristico de A?",
    options: ["(lambda-2)(lambda-3)", "(lambda+2)(lambda+3)", "lambda^2-5lambda+5", "lambda^2+5lambda+6"],
    correctIndex: 0,
    correctAnswer: "(lambda-2)(lambda-3)",
    explanation:
      "El polinomio caracteristico es det(A-lambda I) = (2-lambda)(3-lambda), equivalente a (lambda-2)(lambda-3)."
  },
  {
    id: "N1-002",
    level: 1,
    topic: "polinomio_caracteristico",
    difficulty: "facil",
    question: "Sea A = [[1,2],[0,4]]. Cual es el polinomio caracteristico de A?",
    options: ["lambda^2-5lambda+4", "lambda^2+5lambda+4", "lambda^2-3lambda+4", "(lambda+1)(lambda+4)"],
    correctIndex: 0,
    correctAnswer: "lambda^2-5lambda+4",
    explanation:
      "Al ser triangular, los valores de la diagonal dan (1-lambda)(4-lambda) = lambda^2 - 5lambda + 4."
  },
  {
    id: "N1-003",
    level: 1,
    topic: "polinomio_caracteristico",
    difficulty: "facil",
    question: "Sea A = [[0,1],[-2,3]]. Cual es el polinomio caracteristico de A?",
    options: ["lambda^2-3lambda+2", "lambda^2+3lambda-2", "lambda^2-lambda-2", "lambda^2+2lambda-3"],
    correctIndex: 0,
    correctAnswer: "lambda^2-3lambda+2",
    explanation:
      "det([-lambda, 1], [-2, 3-lambda]) = (-lambda)(3-lambda) - (-2)(1) = lambda^2 - 3lambda + 2."
  },
  {
    id: "N1-004",
    level: 1,
    topic: "polinomio_caracteristico",
    difficulty: "facil",
    question: "Sea A = [[-1,0],[0,-1]]. Cual es el polinomio caracteristico de A?",
    options: ["lambda^2-2lambda+1", "lambda^2+2lambda+1", "lambda^2-1", "lambda^2+1"],
    correctIndex: 1,
    correctAnswer: "lambda^2+2lambda+1",
    explanation:
      "det(A-lambda I) = (-1-lambda)(-1-lambda) = (lambda+1)^2 = lambda^2 + 2lambda + 1."
  },
  {
    id: "N1-005",
    level: 1,
    topic: "polinomio_caracteristico",
    difficulty: "facil",
    question: "Sea A = [[5,4],[1,2]]. Cual es el polinomio caracteristico de A?",
    options: ["lambda^2-7lambda+6", "lambda^2+7lambda+6", "lambda^2-7lambda+10", "lambda^2-3lambda+6"],
    correctIndex: 0,
    correctAnswer: "lambda^2-7lambda+6",
    explanation:
      "det(A-lambda I) = (5-lambda)(2-lambda) - 4 = lambda^2 - 7lambda + 10 - 4 = lambda^2 - 7lambda + 6."
  },
  {
    id: "N1-006",
    level: 1,
    topic: "polinomio_caracteristico",
    difficulty: "facil",
    question: "Sea A = [[3,1],[-2,0]]. Cual es el polinomio caracteristico de A?",
    options: ["lambda^2-3lambda-2", "lambda^2+3lambda+2", "lambda^2-3lambda+2", "lambda^2-lambda+2"],
    correctIndex: 2,
    correctAnswer: "lambda^2-3lambda+2",
    explanation:
      "det(A-lambda I) = (3-lambda)(-lambda) - (-2) = -3lambda + lambda^2 + 2 = lambda^2 - 3lambda + 2."
  },
  {
    id: "N1-007",
    level: 1,
    topic: "polinomio_caracteristico",
    difficulty: "facil",
    question: "Sea A = [[0,0],[0,0]]. Cual es el polinomio caracteristico de A?",
    options: ["lambda", "lambda^2", "lambda-1", "lambda^2-1"],
    correctIndex: 1,
    correctAnswer: "lambda^2",
    explanation: "Al ser la matriz nula, det(-lambda I) = (-lambda)(-lambda) = lambda^2."
  },
  {
    id: "N1-008",
    level: 1,
    topic: "polinomio_caracteristico",
    difficulty: "facil",
    question: "Sea A = [[2,-1],[1,0]]. Cual es el polinomio caracteristico de A?",
    options: ["lambda^2-2lambda+1", "lambda^2+2lambda-1", "lambda^2-lambda+2", "lambda^2-2lambda-1"],
    correctIndex: 0,
    correctAnswer: "lambda^2-2lambda+1",
    explanation: "det(A-lambda I) = (2-lambda)(-lambda) - (-1) = lambda^2 - 2lambda + 1."
  },
  {
    id: "N1-009",
    level: 1,
    topic: "polinomio_caracteristico",
    difficulty: "facil",
    question: "Sea A = [[4,-2],[1,1]]. Cual es el polinomio caracteristico de A?",
    options: ["lambda^2-5lambda+2", "lambda^2-5lambda+6", "lambda^2+5lambda+6", "lambda^2-4lambda+6"],
    correctIndex: 1,
    correctAnswer: "lambda^2-5lambda+6",
    explanation:
      "det(A-lambda I) = (4-lambda)(1-lambda) - (-2) = lambda^2 - 5lambda + 4 + 2 = lambda^2 - 5lambda + 6."
  },
  {
    id: "N1-010",
    level: 1,
    topic: "polinomio_caracteristico",
    difficulty: "medio",
    question: "Sea A = [[1,0,0],[0,2,0],[0,0,3]]. Cual es el polinomio caracteristico de A?",
    options: [
      "-(lambda-1)(lambda-2)(lambda-3)",
      "(lambda+1)(lambda+2)(lambda+3)",
      "-lambda^3-6lambda^2-11lambda-6",
      "-(lambda-1)(lambda+2)(lambda-3)"
    ],
    correctIndex: 0,
    correctAnswer: "-(lambda-1)(lambda-2)(lambda-3)",
    explanation:
      "En una matriz diagonal 3x3, el polinomio es -(lambda-a11)(lambda-a22)(lambda-a33)."
  },
  {
    id: "N1-011",
    level: 1,
    topic: "polinomio_caracteristico",
    difficulty: "medio",
    question: "Sea A = [[2,1,0],[0,2,0],[0,0,1]]. Cual es el polinomio caracteristico de A?",
    options: ["-(lambda-2)(lambda-1)^2", "-(lambda-2)^2(lambda-1)", "(lambda-2)^2(lambda-1)", "-(lambda+2)^2(lambda+1)"],
    correctIndex: 1,
    correctAnswer: "-(lambda-2)^2(lambda-1)",
    explanation:
      "La matriz es triangular superior. Su determinante se calcula multiplicando los elementos de la diagonal principal restados por lambda."
  },
  {
    id: "N1-012",
    level: 1,
    topic: "polinomio_caracteristico",
    difficulty: "medio",
    question: "Sea A = [[0,1,0],[0,0,1],[1,0,0]]. Cual es el polinomio caracteristico de A?",
    options: ["-lambda^3-1", "-lambda^3+1", "lambda^3-1", "-lambda^3+lambda"],
    correctIndex: 1,
    correctAnswer: "-lambda^3+1",
    explanation:
      "Al calcular el determinante por cofactores, se obtiene det(A-lambda I) = -lambda(lambda^2) + 1(1) = -lambda^3 + 1."
  },
  {
    id: "N1-013",
    level: 1,
    topic: "polinomio_caracteristico",
    difficulty: "medio",
    question: "Sea A = [[-1,0,0],[0,1,1],[0,0,1]]. Cual es el polinomio caracteristico de A?",
    options: ["-(lambda-1)(lambda+1)^2", "-(lambda+1)(lambda-1)^2", "(lambda+1)(lambda-1)^2", "-(lambda+1)^3"],
    correctIndex: 1,
    correctAnswer: "-(lambda+1)(lambda-1)^2",
    explanation:
      "Al ser triangular por bloques, se multiplican los factores de la diagonal: (-1-lambda)(1-lambda)(1-lambda)."
  },
  {
    id: "N1-014",
    level: 1,
    topic: "polinomio_caracteristico",
    difficulty: "dificil",
    question: "Sea A = [[1,2,3],[0,1,2],[0,0,1]]. Cual es el polinomio caracteristico de A?",
    options: ["-(lambda-1)^3", "(lambda-1)^3", "-(lambda+1)^3", "-lambda^3+1"],
    correctIndex: 0,
    correctAnswer: "-(lambda-1)^3",
    explanation:
      "Es una matriz triangular superior, los valores de la diagonal son todos 1, generando el factor cubico negativo."
  },
  {
    id: "N1-015",
    level: 1,
    topic: "polinomio_caracteristico",
    difficulty: "dificil",
    question: "Sea A = [[2,2,0],[2,2,0],[0,0,1]]. Cual es el polinomio caracteristico de A?",
    options: ["-lambda^3+5lambda^2-4lambda", "-lambda^3-5lambda^2+4lambda", "lambda^3-5lambda^2+4lambda", "-lambda^3+4lambda^2-5lambda"],
    correctIndex: 0,
    correctAnswer: "-lambda^3+5lambda^2-4lambda",
    explanation:
      "El determinante es (1-lambda)*[(2-lambda)^2 - 4] = (1-lambda)*(lambda^2 - 4lambda) = -lambda^3 + 5lambda^2 - 4lambda."
  },
  {
    id: "N2-001",
    level: 2,
    topic: "valores_propios",
    difficulty: "facil",
    question: "Sea A = [[2,0],[0,3]]. Cuales son los valores propios de A?",
    options: ["2 y 3", "-2 y -3", "0 y 5", "1 y 6"],
    correctIndex: 0,
    correctAnswer: "2 y 3",
    explanation: "En una matriz diagonal, los valores propios son exactamente los elementos de la diagonal principal."
  },
  {
    id: "N2-002",
    level: 2,
    topic: "valores_propios",
    difficulty: "facil",
    question: "Sea A = [[1,4],[0,-1]]. Cuales son los valores propios de A?",
    options: ["1 y 4", "1 y -1", "0 y 4", "-1 y -4"],
    correctIndex: 1,
    correctAnswer: "1 y -1",
    explanation: "Al ser una matriz triangular, los valores propios son los numeros de la diagonal: 1 y -1."
  },
  {
    id: "N2-003",
    level: 2,
    topic: "valores_propios",
    difficulty: "facil",
    question: "Sea A = [[0,1],[-2,3]]. Cuales son los valores propios de A?",
    options: ["1 y 2", "-1 y -2", "0 y 3", "-2 y 3"],
    correctIndex: 0,
    correctAnswer: "1 y 2",
    explanation: "El polinomio caracteristico es lambda^2 - 3lambda + 2 = 0, cuyas raices son 1 y 2."
  },
  {
    id: "N2-004",
    level: 2,
    topic: "valores_propios",
    difficulty: "facil",
    question: "Sea A = [[3,1],[0,3]]. Cuales son los valores propios de A?",
    options: ["3 (multiplicidad 2)", "1 y 3", "0 y 3", "-3 y -3"],
    correctIndex: 0,
    correctAnswer: "3 (multiplicidad 2)",
    explanation: "La matriz es triangular con ambos elementos de la diagonal iguales a 3."
  },
  {
    id: "N2-005",
    level: 2,
    topic: "valores_propios",
    difficulty: "facil",
    question: "Sea A = [[5,-2],[1,2]]. Cuales son los valores propios de A?",
    options: ["3 y 4", "5 y 2", "6 y 1", "-3 y -4"],
    correctIndex: 0,
    correctAnswer: "3 y 4",
    explanation:
      "Polinomio: lambda^2 - 7lambda + 12 = 0. Al factorizar (lambda-3)(lambda-4)=0, las raices son 3 y 4."
  },
  {
    id: "N2-006",
    level: 2,
    topic: "valores_propios",
    difficulty: "facil",
    question: "Sea A = [[1,-1],[1,3]]. Cuales son los valores propios de A?",
    options: ["2 (multiplicidad 2)", "1 y 3", "4 y 0", "-2 (multiplicidad 2)"],
    correctIndex: 0,
    correctAnswer: "2 (multiplicidad 2)",
    explanation: "Polinomio: lambda^2 - 4lambda + 4 = 0, lo que es (lambda-2)^2 = 0, raiz doble en 2."
  },
  {
    id: "N2-007",
    level: 2,
    topic: "valores_propios",
    difficulty: "facil",
    question: "Sea A = [[4,0],[2,4]]. Cuales son los valores propios de A?",
    options: ["2 y 4", "4 (multiplicidad 2)", "0 y 4", "-4 y -4"],
    correctIndex: 1,
    correctAnswer: "4 (multiplicidad 2)",
    explanation: "Es triangular inferior, por lo que los valores de la diagonal dictan los valores propios (4, doble)."
  },
  {
    id: "N2-008",
    level: 2,
    topic: "valores_propios",
    difficulty: "facil",
    question: "Sea A = [[-2,-1],[1,-4]]. Cuales son los valores propios de A?",
    options: ["-3 (multiplicidad 2)", "-2 y -4", "-1 y 1", "3 (multiplicidad 2)"],
    correctIndex: 0,
    correctAnswer: "-3 (multiplicidad 2)",
    explanation: "Polinomio: lambda^2 + 6lambda + 9 = 0, equivalente a (lambda+3)^2 = 0. Raiz doble en -3."
  },
  {
    id: "N2-009",
    level: 2,
    topic: "valores_propios",
    difficulty: "facil",
    question: "Sea A = [[0,4],[1,0]]. Cuales son los valores propios de A?",
    options: ["2 y -2", "0 y 4", "1 y 4", "-2 y 0"],
    correctIndex: 0,
    correctAnswer: "2 y -2",
    explanation: "Polinomio: lambda^2 - 4 = 0. Las raices de esta ecuacion son 2 y -2."
  },
  {
    id: "N2-010",
    level: 2,
    topic: "valores_propios",
    difficulty: "medio",
    question: "Sea A = [[1,2,3],[0,4,5],[0,0,6]]. Cuales son los valores propios de A?",
    options: ["0, 1 y 2", "1, 4 y 6", "2, 3 y 5", "1, 2 y 3"],
    correctIndex: 1,
    correctAnswer: "1, 4 y 6",
    explanation: "Por ser triangular superior 3x3, los valores propios se leen directamente de su diagonal."
  },
  {
    id: "N2-011",
    level: 2,
    topic: "valores_propios",
    difficulty: "medio",
    question: "Sea A = [[-1,0,0],[2,2,0],[3,1,3]]. Cuales son los valores propios de A?",
    options: ["-1, 2 y 3", "0, 1 y 2", "-1, 0 y 3", "2, 3 y 1"],
    correctIndex: 0,
    correctAnswer: "-1, 2 y 3",
    explanation:
      "Es triangular inferior, por tanto, sus valores propios coinciden con la diagonal principal: -1, 2 y 3."
  },
  {
    id: "N2-012",
    level: 2,
    topic: "valores_propios",
    difficulty: "medio",
    question: "Sea A = [[2,0,0],[0,2,0],[0,0,-1]]. Cuales son los valores propios de A?",
    options: ["2 (mult 2) y -1", "2 y -1 (mult 2)", "0, 2 y -1", "2, -2 y -1"],
    correctIndex: 0,
    correctAnswer: "2 (mult 2) y -1",
    explanation: "Matriz diagonal con el 2 repetido dos veces y el -1 una vez."
  },
  {
    id: "N2-013",
    level: 2,
    topic: "valores_propios",
    difficulty: "medio",
    question: "Sea A = [[0,1,0],[0,0,1],[0,0,0]]. Cuales son los valores propios de A?",
    options: ["0, 1 y -1", "1 (mult 3)", "0 (mult 3)", "0, 1 y 2"],
    correctIndex: 2,
    correctAnswer: "0 (mult 3)",
    explanation: "Polinomio -lambda^3 = 0, el unico valor propio es 0 con multiplicidad algebraica 3."
  },
  {
    id: "N2-014",
    level: 2,
    topic: "valores_propios",
    difficulty: "dificil",
    question: "Sea A = [[1,1,1],[1,1,1],[1,1,1]]. Cuales son los valores propios de A?",
    options: ["1, 1 y 1", "0 (mult 2) y 3", "0, 1 y 2", "-1, 0 y 3"],
    correctIndex: 1,
    correctAnswer: "0 (mult 2) y 3",
    explanation:
      "El rango es 1, por lo que 0 es valor propio con multiplicidad 2. La traza es 3, por lo que el tercer valor propio es 3."
  },
  {
    id: "N2-015",
    level: 2,
    topic: "valores_propios",
    difficulty: "dificil",
    question: "Sea A = [[0,1,0],[1,0,0],[0,0,2]]. Cuales son los valores propios de A?",
    options: ["0, 1 y 2", "1, -1 y 2", "0, 0 y 2", "1 (mult 2) y 2"],
    correctIndex: 1,
    correctAnswer: "1, -1 y 2",
    explanation:
      "Matriz por bloques. El bloque 2x2 [[0,1],[1,0]] tiene valores propios 1 y -1. El bloque 1x1 da 2."
  },
  {
    id: "N3-001",
    level: 3,
    topic: "vectores_propios",
    difficulty: "facil",
    question: "Sea A = [[2,0],[0,3]]. Para lambda = 2, cual es un vector propio asociado?",
    options: ["[1, 0]^T", "[0, 1]^T", "[1, 1]^T", "[2, 3]^T"],
    correctIndex: 0,
    correctAnswer: "[1, 0]^T",
    explanation:
      "Resolviendo (A-2I)v = 0, obtenemos [[0,0],[0,1]][x,y]^T = [0,0]^T, lo que implica y=0, x libre."
  },
  {
    id: "N3-002",
    level: 3,
    topic: "vectores_propios",
    difficulty: "facil",
    question: "Sea A = [[1,2],[0,4]]. Para lambda = 1, cual es un vector propio asociado?",
    options: ["[2, 1]^T", "[1, 0]^T", "[0, 1]^T", "[1, 2]^T"],
    correctIndex: 1,
    correctAnswer: "[1, 0]^T",
    explanation:
      "Al evaluar A-I queda [[0,2],[0,3]], esto exige y=0 y x libre, dando el vector [1,0]^T."
  },
  {
    id: "N3-003",
    level: 3,
    topic: "vectores_propios",
    difficulty: "facil",
    question: "Sea A = [[1,2],[0,4]]. Para lambda = 4, cual es un vector propio asociado?",
    options: ["[1, 0]^T", "[2, 3]^T", "[1, 1]^T", "[0, 1]^T"],
    correctIndex: 1,
    correctAnswer: "[2, 3]^T",
    explanation:
      "Evaluando A-4I queda [[-3,2],[0,0]], la ecuacion es -3x+2y=0, es decir y=3/2x. Un vector proporcional es [2,3]^T."
  },
  {
    id: "N3-004",
    level: 3,
    topic: "vectores_propios",
    difficulty: "facil",
    question: "Sea A = [[0,1],[1,0]]. Para lambda = 1, cual es un vector propio asociado?",
    options: ["[1, -1]^T", "[1, 1]^T", "[1, 0]^T", "[0, 1]^T"],
    correctIndex: 1,
    correctAnswer: "[1, 1]^T",
    explanation:
      "(A-I)v = [[-1,1],[1,-1]][x,y]^T = 0, requiere -x+y=0, por tanto x=y. Vector base: [1,1]^T."
  },
  {
    id: "N3-005",
    level: 3,
    topic: "vectores_propios",
    difficulty: "facil",
    question: "Sea A = [[0,1],[1,0]]. Para lambda = -1, cual es un vector propio asociado?",
    options: ["[1, 1]^T", "[0, 1]^T", "[1, -1]^T", "[-1, -1]^T"],
    correctIndex: 2,
    correctAnswer: "[1, -1]^T",
    explanation:
      "(A+I)v = [[1,1],[1,1]][x,y]^T = 0, requiere x+y=0, por tanto x=-y. Vector base: [1,-1]^T."
  },
  {
    id: "N3-006",
    level: 3,
    topic: "vectores_propios",
    difficulty: "facil",
    question: "Sea A = [[3,1],[1,3]]. Para lambda = 4, cual es un vector propio asociado?",
    options: ["[1, 1]^T", "[1, -1]^T", "[3, 1]^T", "[1, 3]^T"],
    correctIndex: 0,
    correctAnswer: "[1, 1]^T",
    explanation:
      "(A-4I)v = [[-1,1],[1,-1]][x,y]^T = 0, lo que nos da la relacion x=y, y el vector [1,1]^T."
  },
  {
    id: "N3-007",
    level: 3,
    topic: "vectores_propios",
    difficulty: "facil",
    question: "Sea A = [[3,1],[1,3]]. Para lambda = 2, cual es un vector propio asociado?",
    options: ["[1, 1]^T", "[-1, -1]^T", "[1, -1]^T", "[3, 2]^T"],
    correctIndex: 2,
    correctAnswer: "[1, -1]^T",
    explanation:
      "(A-2I)v = [[1,1],[1,1]][x,y]^T = 0, lo que nos da x=-y, y el vector base [1,-1]^T."
  },
  {
    id: "N3-008",
    level: 3,
    topic: "vectores_propios",
    difficulty: "facil",
    question: "Sea A = [[1,-1],[-1,1]]. Para lambda = 0, cual es un vector propio asociado?",
    options: ["[1, -1]^T", "[1, 1]^T", "[0, 1]^T", "[1, 0]^T"],
    correctIndex: 1,
    correctAnswer: "[1, 1]^T",
    explanation:
      "(A-0I)v = A v = 0. [[1,-1],[-1,1]][x,y]^T = 0 exige x-y=0, dando vector [1,1]^T."
  },
  {
    id: "N3-009",
    level: 3,
    topic: "vectores_propios",
    difficulty: "facil",
    question: "Sea A = [[1,-1],[-1,1]]. Para lambda = 2, cual es un vector propio asociado?",
    options: ["[1, 1]^T", "[1, -1]^T", "[-1, -1]^T", "[0, 2]^T"],
    correctIndex: 1,
    correctAnswer: "[1, -1]^T",
    explanation:
      "(A-2I)v = [[-1,-1],[-1,-1]][x,y]^T = 0 exige -x-y=0 o x=-y, generando el vector [1,-1]^T."
  },
  {
    id: "N3-010",
    level: 3,
    topic: "vectores_propios",
    difficulty: "medio",
    question: "Sea A = [[1,0,0],[0,2,0],[0,0,3]]. Para lambda = 1, cual es un vector propio?",
    options: ["[0, 1, 0]^T", "[0, 0, 1]^T", "[1, 0, 0]^T", "[1, 1, 1]^T"],
    correctIndex: 2,
    correctAnswer: "[1, 0, 0]^T",
    explanation:
      "Es el primer vector de la base canonica e1, que se asocia directamente al primer elemento diagonal."
  },
  {
    id: "N3-011",
    level: 3,
    topic: "vectores_propios",
    difficulty: "medio",
    question: "Sea A = [[2,1,0],[0,2,0],[0,0,1]]. Para lambda = 1, cual es un vector propio?",
    options: ["[1, 0, 0]^T", "[0, 1, 0]^T", "[0, 0, 1]^T", "[1, 1, 0]^T"],
    correctIndex: 2,
    correctAnswer: "[0, 0, 1]^T",
    explanation:
      "Al resolver (A-I)v=0, las primeras dos filas exigen que x e y sean 0, dejando a z libre, [0,0,1]^T."
  },
  {
    id: "N3-012",
    level: 3,
    topic: "vectores_propios",
    difficulty: "medio",
    question: "Sea A = [[1,1,1],[0,2,1],[0,0,3]]. Para lambda = 1, cual es un vector propio?",
    options: ["[1, 0, 0]^T", "[1, 1, 0]^T", "[0, 1, 1]^T", "[1, 1, 1]^T"],
    correctIndex: 0,
    correctAnswer: "[1, 0, 0]^T",
    explanation:
      "A-I = [[0,1,1],[0,1,1],[0,0,2]], lo cual fuerza a y=0 y z=0, dejando solo la x libre: [1,0,0]^T."
  },
  {
    id: "N3-013",
    level: 3,
    topic: "vectores_propios",
    difficulty: "medio",
    question: "Sea A = [[1,1,1],[1,1,1],[1,1,1]]. Para lambda = 3, cual es un vector propio?",
    options: ["[1, -1, 0]^T", "[1, 1, 1]^T", "[0, 1, -1]^T", "[1, 0, 0]^T"],
    correctIndex: 1,
    correctAnswer: "[1, 1, 1]^T",
    explanation:
      "Al multiplicar A por [1,1,1]^T, se obtiene [3,3,3]^T, que es exactamente 3*[1,1,1]^T."
  },
  {
    id: "N3-014",
    level: 3,
    topic: "vectores_propios",
    difficulty: "dificil",
    question: "Sea A = [[2,0,0],[1,2,0],[0,1,2]]. Para lambda = 2, cual es un vector propio?",
    options: ["[1, 0, 0]^T", "[0, 1, 0]^T", "[0, 0, 1]^T", "[1, 1, 1]^T"],
    correctIndex: 2,
    correctAnswer: "[0, 0, 1]^T",
    explanation:
      "(A-2I) es una matriz estrictamente triangular inferior que fuerza x=0 e y=0, dejando z libre: [0,0,1]^T."
  },
  {
    id: "N3-015",
    level: 3,
    topic: "vectores_propios",
    difficulty: "dificil",
    question: "Sea A = [[1,1,1],[0,1,1],[0,0,2]]. Para lambda = 2, cual es un vector propio asociado?",
    options: ["[1, 0, 0]^T", "[0, 1, 1]^T", "[2, 1, 1]^T", "[1, 1, 1]^T"],
    correctIndex: 2,
    correctAnswer: "[2, 1, 1]^T",
    explanation:
      "(A-2I)v = [[-1,1,1],[0,-1,1],[0,0,0]][x,y,z]^T=0. De -y+z=0 => y=z. De -x+y+z=0 => x=2z."
  },
  {
    id: "N4-001",
    level: 4,
    topic: "diagonalizacion",
    difficulty: "facil",
    question: "Es la matriz A = [[1,1],[0,1]] diagonalizable?",
    options: [
      "Si, porque es triangular.",
      "Si, porque su determinante es 1.",
      "No, porque la multiplicidad geometrica de lambda=1 es menor a la algebraica.",
      "No, porque no tiene inversa."
    ],
    correctIndex: 2,
    correctAnswer: "No, porque la multiplicidad geometrica de lambda=1 es menor a la algebraica.",
    explanation:
      "El unico valor propio es 1 (mult. alg. 2), pero solo genera un vector propio independiente [1,0]^T (mult. geom. 1)."
  },
  {
    id: "N4-002",
    level: 4,
    topic: "diagonalizacion",
    difficulty: "facil",
    question: "Es la matriz A = [[2,0],[0,3]] diagonalizable?",
    options: [
      "Si, ya es diagonal y sus valores propios son distintos.",
      "No, no tiene suficientes vectores propios.",
      "No, su determinante es 6.",
      "Si, pero solo en los numeros complejos."
    ],
    correctIndex: 0,
    correctAnswer: "Si, ya es diagonal y sus valores propios son distintos.",
    explanation:
      "Al tener valores propios reales distintos (2 y 3) para tamano 2x2, es automaticamente diagonalizable (y ya esta diagonal)."
  },
  {
    id: "N4-003",
    level: 4,
    topic: "diagonalizacion",
    difficulty: "facil",
    question: "Sea A = [[0,1],[1,0]]. Cual podria ser su matriz diagonal D equivalente?",
    options: ["[[1,0],[0,1]]", "[[0,0],[0,0]]", "[[1,0],[0,-1]]", "[[-1,0],[0,-1]]"],
    correctIndex: 2,
    correctAnswer: "[[1,0],[0,-1]]",
    explanation:
      "Los valores propios de A son 1 y -1, por lo que su matriz diagonal D los debe tener en la diagonal principal."
  },
  {
    id: "N4-004",
    level: 4,
    topic: "diagonalizacion",
    difficulty: "facil",
    question: "Es la matriz A = [[1,2],[0,1]] diagonalizable?",
    options: [
      "Si, porque tiene valores reales.",
      "Si, porque tiene inversa.",
      "No, porque su espacio propio para lambda=1 tiene dimension 1.",
      "No, porque no es cuadrada."
    ],
    correctIndex: 2,
    correctAnswer: "No, porque su espacio propio para lambda=1 tiene dimension 1.",
    explanation:
      "Como la multiplicidad algebraica de 1 es 2, pero su multiplicidad geometrica es 1, no es diagonalizable."
  },
  {
    id: "N4-005",
    level: 4,
    topic: "diagonalizacion",
    difficulty: "facil",
    question: "Es la matriz nula [[0,0],[0,0]] diagonalizable?",
    options: [
      "Si, ya es diagonal.",
      "No, el determinante es 0.",
      "No, los valores propios son repetidos.",
      "Si, pero la matriz de paso P es nula."
    ],
    correctIndex: 0,
    correctAnswer: "Si, ya es diagonal.",
    explanation: "Cualquier matriz que ya sea diagonal es trivialmente diagonalizable (con P = Identidad)."
  },
  {
    id: "N4-006",
    level: 4,
    topic: "diagonalizacion",
    difficulty: "facil",
    question: "Sea A = [[3,1],[1,3]]. Cual es su matriz diagonal D correspondiente?",
    options: ["[[2,0],[0,4]]", "[[3,0],[0,3]]", "[[1,0],[0,1]]", "[[4,0],[0,-2]]"],
    correctIndex: 0,
    correctAnswer: "[[2,0],[0,4]]",
    explanation: "Sus valores propios son 4 y 2, los cuales componen los elementos de la diagonal de D."
  },
  {
    id: "N4-007",
    level: 4,
    topic: "diagonalizacion",
    difficulty: "facil",
    question: "Sea A = [[1,2],[2,1]]. Cual es su matriz diagonal D correspondiente?",
    options: ["[[1,0],[0,2]]", "[[3,0],[0,-1]]", "[[2,0],[0,2]]", "[[-3,0],[0,1]]"],
    correctIndex: 1,
    correctAnswer: "[[3,0],[0,-1]]",
    explanation:
      "Los valores propios son 3 y -1 (raices de lambda^2 - 2lambda - 3 = 0), que forman la diagonal."
  },
  {
    id: "N4-008",
    level: 4,
    topic: "diagonalizacion",
    difficulty: "facil",
    question: "Para la matriz diagonal A = [[2,0],[0,3]], cual puede ser una matriz de paso P?",
    options: ["[[0,1],[1,0]]", "[[1,1],[1,1]]", "[[1,0],[0,1]]", "[[2,0],[0,3]]"],
    correctIndex: 2,
    correctAnswer: "[[1,0],[0,1]]",
    explanation:
      "Al ya ser diagonal, la base de vectores propios es la base canonica, por tanto P es la matriz Identidad."
  },
  {
    id: "N4-009",
    level: 4,
    topic: "diagonalizacion",
    difficulty: "facil",
    question: "Es la matriz A = [[1,1],[1,1]] diagonalizable?",
    options: [
      "Si, porque es simetrica con entradas reales.",
      "No, porque su determinante es 0.",
      "No, porque un valor propio es repetido.",
      "Si, pero D tendria solo unos."
    ],
    correctIndex: 0,
    correctAnswer: "Si, porque es simetrica con entradas reales.",
    explanation:
      "Por el teorema espectral, toda matriz simetrica con entradas reales es diagonalizable ortogonalmente."
  },
  {
    id: "N4-010",
    level: 4,
    topic: "diagonalizacion",
    difficulty: "medio",
    question: "Es la matriz A = [[1,1,0],[0,1,1],[0,0,1]] diagonalizable?",
    options: [
      "Si, tiene inversa.",
      "No, la multiplicidad geometrica de lambda=1 es 1, menor que 3.",
      "Si, es triangular superior.",
      "No, porque no es cuadrada."
    ],
    correctIndex: 1,
    correctAnswer: "No, la multiplicidad geometrica de lambda=1 es 1, menor que 3.",
    explanation:
      "El valor propio es 1 (mult. alg. 3), pero el sistema (A-I)v = 0 solo arroja 1 vector propio independiente."
  },
  {
    id: "N4-011",
    level: 4,
    topic: "diagonalizacion",
    difficulty: "medio",
    question: "Sea A = [[1,0,0],[0,2,0],[0,0,3]]. Cual es su matriz D?",
    options: ["diag(1, 1, 1)", "diag(3, 2, 1) o diag(1, 2, 3)", "diag(0, 0, 0)", "No es diagonalizable"],
    correctIndex: 1,
    correctAnswer: "diag(3, 2, 1) o diag(1, 2, 3)",
    explanation:
      "Al ser ya diagonal, la matriz D esta compuesta por los mismos elementos de su diagonal principal, sin importar el orden."
  },
  {
    id: "N4-012",
    level: 4,
    topic: "diagonalizacion",
    difficulty: "medio",
    question: "Es la matriz A = [[2,0,0],[0,2,0],[0,0,2]] diagonalizable?",
    options: [
      "No, porque tiene un valor propio repetido 3 veces.",
      "Si, ya es diagonal (es un multiplo escalar de la identidad).",
      "No, le faltan vectores propios.",
      "Si, pero D no es unica."
    ],
    correctIndex: 1,
    correctAnswer: "Si, ya es diagonal (es un multiplo escalar de la identidad).",
    explanation:
      "Las matrices escalares ya son diagonales, su multiplicidad geometrica y algebraica coinciden plenamente (ambas son 3)."
  },
  {
    id: "N4-013",
    level: 4,
    topic: "diagonalizacion",
    difficulty: "medio",
    question: "Es A = [[1,2,3],[0,4,5],[0,0,6]] diagonalizable?",
    options: [
      "No, es triangular y no diagonal.",
      "Si, porque tiene 3 valores propios reales y distintos.",
      "No, el determinante no es 0.",
      "Si, porque la traza es par."
    ],
    correctIndex: 1,
    correctAnswer: "Si, porque tiene 3 valores propios reales y distintos.",
    explanation: "Toda matriz nxn con n valores propios reales distintos es automaticamente diagonalizable."
  },
  {
    id: "N4-014",
    level: 4,
    topic: "diagonalizacion",
    difficulty: "dificil",
    question: "Es A = [[1,1,1],[1,1,1],[1,1,1]] diagonalizable?",
    options: [
      "No, todos los elementos son iguales.",
      "Si, por ser matriz simetrica real siempre es diagonalizable.",
      "No, tiene valores propios iguales a cero.",
      "Si, pero la matriz D es de orden 2x2."
    ],
    correctIndex: 1,
    correctAnswer: "Si, por ser matriz simetrica real siempre es diagonalizable.",
    explanation:
      "Por el teorema espectral, las matrices reales y simetricas garantizan multiplicidades completas y diagonalizacion."
  },
  {
    id: "N4-015",
    level: 4,
    topic: "diagonalizacion",
    difficulty: "dificil",
    question:
      "Una matriz 3x3 tiene valores propios 1 (doble) y 3 (simple). Condicion para ser diagonalizable?",
    options: [
      "Que el determinante sea 3.",
      "Que la multiplicidad geometrica de lambda=1 sea 2.",
      "Que la matriz sea triangular.",
      "Que el vector propio de lambda=3 sea el vector nulo."
    ],
    correctIndex: 1,
    correctAnswer: "Que la multiplicidad geometrica de lambda=1 sea 2.",
    explanation:
      "Para diagonalizar, la dimension del espacio propio para cada valor propio multiple debe igualar su multiplicidad algebraica."
  }
];

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffleOptions(options) {
  const values = [...options];
  for (let i = values.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}

function filterByDifficulty(questions, difficulty) {
  return questions.filter((item) => item.difficulty === difficulty);
}

function pickUnseen(candidates, usedIds) {
  return candidates.filter((item) => !usedIds.has(item.id));
}

export function pickQuestionForLevel(level, kind, usedIds = new Set()) {
  const levelQuestions = QUESTION_BANK.filter((item) => item.level === level);
  if (!levelQuestions.length) {
    return null;
  }

  const priority = kind === "boss" ? ["dificil", "medio", "facil"] : ["facil", "medio", "dificil"];

  for (let i = 0; i < priority.length; i += 1) {
    const difficulty = priority[i];
    const pool = pickUnseen(filterByDifficulty(levelQuestions, difficulty), usedIds);
    if (pool.length) {
      return randomItem(pool);
    }
  }

  const unseenLevelPool = pickUnseen(levelQuestions, usedIds);
  if (unseenLevelPool.length) {
    return randomItem(unseenLevelPool);
  }

  return randomItem(levelQuestions);
}

export { QUESTION_BANK, shuffleOptions };
