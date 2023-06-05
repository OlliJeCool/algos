const newMatrix = [
    [0, 2, 4, Infinity],
    [2, 0, Infinity, 1],
    [4, Infinity, 0, 3],
    [Infinity, 1, 3, 0],
  ];

const dijkstras = (G: number[][], start: number): number[] => {
    const distances: number[] = new Array<number>(G[0].length).fill(Infinity);
    const unvisited: number[] = [];
    for (let i = 0; i < G[0].length; i++) {
        unvisited[i] = i;
    }
    distances[start] = 0;

    while(unvisited.length !== 0){
        let min_node: number = -1;
        unvisited.forEach((node) => {
            if(min_node === -1) min_node = node;
            else if(distances[node] < distances[min_node]) min_node = node;
        })

        for (let i = 0; i < G[min_node].length; i++) {
            if(G[min_node][i] + distances[min_node] < distances[i]) distances[i] = G[min_node][i] + distances[min_node];
        }
        unvisited.splice(unvisited.indexOf(min_node), 1);
    }

    return distances;

}


const bellmanford = (G: number[][], start: number): number[] => {
    const distances: number[] = new Array<number>(G[0].length).fill(Infinity);
    distances[start] = 0;

    for (let i = 0; i < G.length - 1; i++) {
        for (let j = 0; j < G[0].length; j++) {
            for(let k = 0; k < G[j].length; k++){
                if(distances[j] + G[j][k] < distances[k])distances[k] = distances[j]+G[j][k]
            }
        }
    }

    for (let i = 0; i < G.length-1; i++) {
        for (let j = 0; j < G[i].length -1; j++) {
            if(distances[i] + G[i][j] < distances[j]) console.log("Negative cycle")
        }
    }

    return distances;
}



const johnsons = (G: number[][]): number[][] => {
    const augmentedGraph: number[][] = [];

    for (let i = 0; i < G.length+1; i++) {
        augmentedGraph[i] = [];
        for (let j = 0; j < G.length+1; j++) {
            if(i === G.length){
                augmentedGraph[i][j] = 0;
            } else if(j === G.length){
                augmentedGraph[i][j] = Infinity;
            } else {
                augmentedGraph[i][j] = G[i][j];
            }
        }
    }

    const distance = bellmanford(augmentedGraph, G.length);

    const reweightedGrap: number[][] = [];
    for (let i = 0; i < G.length; i++) {
        reweightedGrap[i] = [];
        for (let j = 0; j < G.length; j++) {
            if(G[i][j] !== Infinity){
                reweightedGrap[i][j] = G[i][j] + distance[i] - distance[j];
            }else{
                reweightedGrap[i][j] = Infinity;
            }
        }
    }

    const shortestPaths: number[][] = [];
    for (let i = 0; i < G.length; i++) {
        shortestPaths[i] = dijkstras(reweightedGrap, i);
    }


    for (let i = 0; i < G.length; i++) {
        for (let j = 0; j < G.length; j++) {
            if(shortestPaths[i][j] !== Infinity){
                shortestPaths[i][j] = shortestPaths[i][j] - distance[i] + distance[j];
            }
        }
    }

    return shortestPaths;
}

console.table(johnsons(newMatrix));




const matrixMultiplication = (A: number[][], B: number[][]): number[][] => {
    const rowsA = A.length;
    const colsA = A[0].length;
    const colsB = B[0].length;
  
    const result: number[][] = [];
  
    for (let i = 0; i < rowsA; i++) {
      result[i] = [];
      for (let j = 0; j < colsB; j++) {
        result[i][j] = 0;
        for (let k = 0; k < colsA; k++) {
          result[i][j] += A[i][k] * B[k][j];
        }
      }
    }
  
    return result;
}

const apsp = (adjMatrix: number[][]): number[][] => {
    const V = adjMatrix.length;
    let D: number[][] = [...adjMatrix];

    for (let k = 0; k < V; k++) {
    D = matrixMultiplication(D, adjMatrix);
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        D[i][j] = Math.min(D[i][j], D[i][k] + adjMatrix[k][j]);
      }
    }
  }

  return D;
}


console.table(apsp(newMatrix))