
import { Card, CardContent } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";

interface LoadingCardProps {
  height?: string;
}

const LoadingCard = ({ height = "h-48" }: LoadingCardProps) => {
  return (
    <Card className={`border-trueshield-light shadow-sm ${height}`}>
      <CardContent className="h-full flex items-center justify-center">
        <Loading text="Loading data..." />
      </CardContent>
    </Card>
  );
};

export default LoadingCard;
