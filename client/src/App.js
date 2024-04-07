import './App.css';
import MainPanel from "./MainPanel";
import SelectionMenu from "./SelectionMenu";

function App() {
    function loadData(year, round, session){
        console.log(year, round, session);
    }
  return (
    <div className="App">
      <SelectionMenu className="SelectionMenu" loadData={loadData}/>
      <MainPanel className="MainPanel"/>
    </div>
  );
}

export default App;
