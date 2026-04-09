import CrudPage from "../../components/common/CrudPage";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { returnConfig } from "../../utils/moduleConfigs";

export default function ReturnDetail() {
  useDocumentTitle("Returns • School Stock Management");
  return <CrudPage config={returnConfig} mode="detail" />;
}
