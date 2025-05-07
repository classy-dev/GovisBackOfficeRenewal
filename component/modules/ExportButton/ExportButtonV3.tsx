import { useState } from 'react';
import dayjs from 'dayjs';
import { BoV3Request } from '@ApiFarm/index';
import { Button } from '@ComponentFarm/atom/Button/Button';
import { Export } from '@ComponentFarm/atom/icons';
import Spinner from '@ComponentFarm/atom/Spinner/Spinner';
import { downloadAxiosResponse } from '@UtilFarm/download';

const ExportButton = ({
  params,
  endPoint,
  title,
  buttonTxt = '내보내기',
}: {
  params: any;
  endPoint: string;
  title: string;
  buttonTxt?: string;
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadRecipeProductList = async () => {
    setIsDownloading(true);
    return BoV3Request.get(endPoint, {
      params: {
        ...params,
        is_export: '1',
      },
      responseType: 'blob',
    })
      .then(
        downloadAxiosResponse(
          `${title}_${dayjs().format('YYYY-MM-DD HH:mm:ss')}.xlsx`
        )
      )
      .catch(() => new Error('다운로드에 실패하였습니다.'))
      .finally(() => setIsDownloading(false));
  };

  return (
    <Button
      variant="gostSecondary"
      LeadingIcon={
        isDownloading ? (
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              overflow: 'hidden',
              width: '3rem',
              marginRight: '0.5rem',
            }}
          >
            <Spinner width={10} height={10} />
          </span>
        ) : (
          <Export />
        )
      }
      onClick={() => downloadRecipeProductList()}
      disabled={isDownloading}
    >
      {buttonTxt}
    </Button>
  );
};

export default ExportButton;
