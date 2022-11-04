export default function NewGameButton({resetFunc}) {
    return (
      <button className="newgamebtn" onClick={resetFunc}>
        New Game
      </button>
    );
  }
