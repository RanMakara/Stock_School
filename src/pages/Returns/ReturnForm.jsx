import CrudPage from "../../components/common/CrudPage";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { returnConfig } from "../../utils/moduleConfigs";

export default function ReturnForm() {
  useDocumentTitle("Returns • School Stock Management");
  return <CrudPage config={returnConfig} mode="form" />;
}
