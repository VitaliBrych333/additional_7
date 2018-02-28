module.exports = function solveSudoku(matrix) {
function Sudoku(matrix) {
    var solved = [];
    var steps = 0;
    var suggest = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for ( var i=0; i<9; i++) {
                solved[i] = [];
                for ( var j=0; j<9; j++ ) {
                    if ( matrix[i][j] ) {
                        solved[i][j] = [matrix[i][j], 'in', []];
                    }
                    else {
                        solved[i][j] = [0, 'unknown', suggest];
                    }
                }
    }

    function arrayDiff (ar1, ar2) {
            var arr_diff = [];
            for ( var i=0; i<ar1.length; i++ ) {
                var is_found = false;
                for ( var j=0; j<ar2.length; j++ ) {
                    if ( ar1[i] == ar2[j] ) {
                        is_found = true;
                        break;
                    }
                }
                if ( !is_found ) {
                    arr_diff[arr_diff.length] = ar1[i];
                }
            }
            return arr_diff;
        };

    function lessRowSuggest(i, j) {
            var less_suggest = solved[i][j][2];
            for ( var k=0; k<9; k++ ) {
                if ( k == j || 'unknown' != solved[i][k][1] ) {
                    continue;
                }
                less_suggest = arrayDiff(less_suggest, solved[i][k][2]);
            }
            return less_suggest;
        }; // end of method lessRowSuggest()

        /**
         * Минимизированное множество предположений по столбцу
         */
        function lessColSuggest(i, j) {
            var less_suggest = solved[i][j][2];
            for ( var k=0; k<9; k++ ) {
                if ( k == i || 'unknown' != solved[k][j][1] ) {
                    continue;
                }
                less_suggest = arrayDiff(less_suggest, solved[k][j][2]);
            }
            return less_suggest;
        }; // end of method lessColSuggest()

        /**
         * Минимизированное множество предположений по секции
         */
        function lessSectSuggest(i, j) {
            var less_suggest = solved[i][j][2];
            var offset = sectOffset(i, j);
            for ( var k=0; k<3; k++ ) {
                for ( var l=0; l<3; l++ ) {
                    if ( ((offset.i+k) == i  && (offset.j+l) == j)|| 'unknown' != solved[offset.i+k][offset.j+l][1] ) {
                        continue;
                    }
                    less_suggest = arrayDiff(less_suggest, solved[offset.i+k][offset.j+l][2]);
                }
            }
            return less_suggest;
        };

    function isFailed() {
            var is_failed = false;
            for ( var i=0; i<9; i++) {
                for ( var j=0; j<9; j++ ) {
                    if ( 'unknown' == solved[i][j][1] && !solved[i][j][2].length ) {
                        is_failed = true;
                    }
                }
            }
            return is_failed;
        }; 

    function isSolved() {
            var is_solved = true;
            for ( var i=0; i<9; i++) {
                for ( var j=0; j<9; j++ ) {
                    if ( 'unknown' == solved[i][j][1] ) {
                        is_solved = false;
                    }
                }
            }
            return is_solved;
        };

    function solveHiddenSingle(i, j) {
            var less_suggest = lessRowSuggest(i, j);
            var changed = 0;
            if ( 1 == less_suggest.length ) {
                markSolved(i, j, less_suggest[0]);
                changed++;
            }
            var less_suggest = lessColSuggest(i, j);
            if ( 1 == less_suggest.length ) {
                markSolved(i, j, less_suggest[0]);
                changed++;
            }
            var less_suggest = lessSectSuggest(i, j);
            if ( 1 == less_suggest.length ) {
                markSolved(i, j, less_suggest[0]);
                changed++;
            }
            return changed;
        };

    function sectOffset(i, j) {
            return {
                j: Math.floor(j/3)*3,
                i: Math.floor(i/3)*3
            };
        }; // end of method sectOffset

    function markSolved(i, j, solve) {
            solved[i][j][0] = solve;
            solved[i][j][1] = 'solved';
        }; // end of method markSolved()

        /**
         * Содержимое строки
         */
        function rowContent(i) {
            var content = [];
            for ( var j=0; j<9; j++ ) {
                if ( 'unknown' != solved[i][j][1] ) {
                    content[content.length] = solved[i][j][0];
                }
            }
            return content;
        }; // end of method rowContent()

        /**
         * Содержимое столбца
         */
        function colContent(j) {
            var content = [];
            for ( var i=0; i<9; i++ ) {
                if ( 'unknown' != solved[i][j][1] ) {
                    content[content.length] = solved[i][j][0];
                }
            }
            return content;
        }; // end of method colContent()

        /**
         * Содержимое секции
         */
        function sectContent(i, j) {
            var content = [];
            var offset = sectOffset(i, j);
            for ( var k=0; k<3; k++ ) {
                for ( var l=0; l<3; l++ ) {
                    if ( 'unknown' != solved[offset.i+k][offset.j+l][1] ) {
                        content[content.length] = solved[offset.i+k][offset.j+l][0];
                    }
                }
            }
            return content;
        };
        
    function solveSingle(i, j) {
            solved[i][j][2] = arrayDiff(solved[i][j][2], rowContent(i));
            solved[i][j][2] = arrayDiff(solved[i][j][2], colContent(j));
            solved[i][j][2] = arrayDiff(solved[i][j][2], sectContent(i, j));
            if ( 1 == solved[i][j][2].length ) {
                // Исключили все варианты кроме одного
                markSolved(i, j, solved[i][j][2][0]);
                return 1;
            }
            return 0;
        }; // end of method solveSingle()
        
     function updateSuggests() {
            var changed = 0;
            var buf = arrayDiff(solved[1][3][2], rowContent(1));
            buf = arrayDiff(buf, colContent(3));
            buf = arrayDiff(buf, sectContent(1, 3));
            for ( var i=0; i<9; i++) {
                for ( var j=0; j<9; j++) {
                    if ( 'unknown' != solved[i][j][1] ) {
                        // Здесь решение либо найдено, либо задано
                        continue;
                    }

                    // "Одиночка"
                    changed += solveSingle(i, j);
                    
                    // "Скрытый одиночка"
                    changed += solveHiddenSingle(i, j);
                }
            }
            return changed;
        };

    
     
        



        
    function solve() {
            var changed = 0;
            do {
                // сужаем множество значений для всех нерешенных чисел
                changed = updateSuggests();
                steps++;
                if ( 81 < steps ) {
                    // Зашита от цикла
                    break;
                }
            } while (changed);
           
    };
        
    solve();
        
  
    return solved;
  }
    //ПРОВЕРКА
    
    function Proverka(a) { var v=0;
      for (var i=0; i<9; i++) {
        for (var j=0; j<9; j++) {
          if (a[i][j]==0) return 0; 
          v =v+ a[i][j];
        }
      }
    if (v==405) {return 1;}
      else {return 0;}
    }


    //ПЕРЕВОД
    
    function Perevod (b) {
       var mat = [];
       for ( var i=0; i < 9; i++) {
          mat[i]=[];
          for ( var j = 0; j < 9; j++) {
            mat[i][j]=b[i][j][0];
          }
       }
    return mat;
    }
    
    var a2 = [[8,   1,  6,  9,  7,  5,  4,  3,  2], [9, 7,  5,  4,  3,  2,  8,  6,  1], [4, 3,  2,  6,  8,  1,  9,  5,  7], [7, 9,  8,  5,  6,  4,  2,  1,  3], [6, 5,  4,  2,  1,  3,  7,  9,  8], [3, 2,  1,  7,  9,  8,  6,  4,  5], [5, 8,  9,  1,  4,  7,  3,  2,  6], [2, 6,  3,  8,  5,  9,  1,  7,  4], [1, 4,  7,  3,  2,  6,  5,  8,  9]];

    var x, y, G=[];
  
    var S = Sudoku(matrix);
    
    var T = Perevod(S);
    
    if (Proverka(T)==1) {return T;}
      else { for (var i=0; i<9; i++) {
//                if (Proverka(T)==1) break;
               for (var j=0; j<9; j++) {
//                  if (Proverka(T)==1) break;
                 if ( T[i][j]==0) {       
//                        if (Proverka(T)==1) break;
                       for (var c=0; c<S[i][j][2].length; c++) {
                       T[i][j]=S[i][j][2][c]; 
                       var N = Sudoku(T);
                       var Y = Perevod(N); 
                       if (Proverka(Y)==1) return Y;
                       }
                                
                          
                  }
              
                }
             }
             
            }
               } 