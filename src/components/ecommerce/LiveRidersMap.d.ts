import { Rider } from '../../types/responses';

interface LiveRidersMapProps {
  riders: Rider[];
}

declare const LiveRidersMap: React.FC<LiveRidersMapProps>;

export default LiveRidersMap;
