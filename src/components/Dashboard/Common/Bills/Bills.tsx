import BillList from "./BillList/BillList";
import BillsOverview from "./BillsOverview/BillsOverview";

const Bills: React.FC = () => {
  return (
    <div className="space-y-6">
      <BillList />
      <BillsOverview />
    </div>
  );
};

export default Bills;
