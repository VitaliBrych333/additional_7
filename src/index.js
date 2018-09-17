module.exports = function solveSudoku(matrix) {

  solve(matrix); 

  function solve(matrix) {
    let i, j, findSolution, value;
    
    for (i = 0; i <= 8; i++) {
      for (j = 0; j <= 8; j++) {
  
        if (matrix[i][j] == 0) {
          for (value = 1; value <= 9; value++) {
            
            if (solution(matrix, i, j, value)) {
              matrix[i][j] = value;
              findSolution = solve(matrix);

              if (findSolution) { return true; }
                matrix[i][j] = 0;
            }            
          }
          return false;
        }
      }
    }
    return true;
  }
  
  // проверка на соответствие условиям судоку
  function solution(matrix, i, j, value) {
    let a, b; 
    
    for (a = 0; a <= 8; a++) {
      if (a != i && matrix[a][j] == value) {
        return false;
      }
    }

    for (a = 0; a <= 8; a++) {
      if (a != j && matrix[i][a] == value) {
        return false;
      }
    }
  
    let y = Math.floor((i / 3)) * 3,
        x = Math.floor((j / 3)) * 3;

    for (a = 0; a < 3; a++) {
      for (b = 0; b < 3; b++) {
        if (a != i && b != j && matrix[y + a][x + b] == value) {
          return false;
        }
      }
    }
    return true;
  }  
    
  return matrix;
  }
