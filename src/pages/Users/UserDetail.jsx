import CrudPage from "../../components/common/CrudPage";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { userConfig } from "../../utils/moduleConfigs";

export default function UserDetail() {
  useDocumentTitle("Users • School Stock Management");
  return <CrudPage config={userConfig} mode="detail" />;
}
