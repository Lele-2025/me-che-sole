export const SETTORI = ["P","Q","R","S"];
export const FILE_ROWS = ["A","B","C","D","E"];
export const COLS = 6;
export const prezzoFila = {A:32,B:26,C:20,D:17,E:14};

export function generateSpots() {
  const spots = [];
  SETTORI.forEach(settore=>{
    FILE_ROWS.forEach(row=>{
      for(let col=1;col<=COLS;col++){
        spots.push({id:settore+"-"+row+col, settore, row, col,
          status:"free", vip:row==="A"||row==="B", price:prezzoFila[row]||14});
      }
    });
  });
  return spots;
}
