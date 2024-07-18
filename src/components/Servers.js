import plus from '../assets/plus.svg';
import github from '../assets/github.svg';

const Servers = () => {
  return (
    <div className="servers">
      <div className="server">
        <img src={plus} alt="Add Server" />
      </div>
      <div className="server">
        <img src={github} alt="Github Logo" />
      </div>

    </div>
  );
}

export default Servers;