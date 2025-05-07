import { FC } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import { SubTitleBoxWrap } from './SubTitleBox';

export const AreaBoxWrap = styled.div`
  width: 100%;
  padding: 2.4rem;
  border-radius: 0.8rem;
  border: 2px solid #e5e5e5;
  background: #fff;

  &.descBottom {
    .area_head {
      margin-bottom: 2.4rem;
    }
    .box_head {
      margin-bottom: 1rem !important;
    }
    .descBottomTxt {
      padding: 0 2.4rem;
      color: var(--color-neutral50);
    }
  }

  &.noPadding {
    padding: 0;
    padding-top: 2.4rem;

    .box_head {
      margin-bottom: 2.4rem;
      .head {
        margin-bottom: 0;
        padding: 0 2.4rem;
      }
    }
  }

  &.underline {
    padding: 0;
    padding-top: 2.4rem;

    &.tab .head {
      align-items: start;
    }

    .box_head {
      display: flex;
      align-items: center;
      margin-bottom: 0;
      border-bottom: 1px solid #e5e5e5;
      .head {
        margin-bottom: 0;
        padding: 0 2.4rem;
      }
    }
    .content {
      padding: 3.6rem 2.4rem;
    }
  }

  & + .areaBox {
    margin-top: 3.2rem;
  }

  .box_head {
    display: flex;
    align-items: center;
    margin-bottom: 3.2rem;
  }

  .head {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0;
    margin-bottom: 1.2rem;

    h2 {
      color: var(--color-neutral10);
      font-size: 1.8rem;
      font-weight: 700;
    }

    .link_more {
      color: var(--color-neutral10);
      font-size: 1.4rem;
      font-weight: 500;
    }

    .box_add_func {
      margin-left: auto;
    }
  }
`;

export const AddTab = styled.ul`
  display: flex;

  right: 2.4rem;
  li {
    &:first-of-type {
      margin-right: 1.6rem;
    }
    padding: 0 1rem 2.4rem;
    button {
      color: #667085;
      font-size: 1.4rem;
      font-weight: 700;
      line-height: 2rem;
      cursor: pointer;
      background: transparent;
    }

    &.on {
      button {
        color: var(--color-blue60);
      }
      border-bottom: 2px solid var(--color-blue60);
    }
  }
`;

export const GridAreaWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 1.6rem));
  gap: 3.2rem;

  .areaBox + .areaBox {
    margin-top: 0;
  }
`;

export const ButtonWidthTextDiv = styled.div`
  display: flex;
  align-items: center;
  margin: 3.2rem 0;
  ${SubTitleBoxWrap} {
    padding: 0;
    margin: 0;
  }
  button {
    margin-left: auto;
  }
`;

interface AreaBoxProps {
  title: string;
  desc?: string;
  descBottomTxt?: string;
  moreLink?: string;
  className?: string;
  addFunc?: React.ReactNode;
  children: React.ReactNode;
}

export const AreaBox: FC<AreaBoxProps> = ({
  title,
  desc,
  descBottomTxt,
  moreLink,
  className,
  addFunc,
  children,
}) => {
  return (
    <AreaBoxWrap className={`areaBox ${className}`}>
      <div className="area_head">
        <div className="box_head">
          <div className="head">
            <h2>{title}</h2>
            <span className="desc">{desc}</span>
            {moreLink && (
              <Link href={moreLink} className="link_more">
                더보기
              </Link>
            )}
            {addFunc && <div className="box_add_func">{addFunc}</div>}
          </div>
        </div>
        {descBottomTxt && <p className="descBottomTxt">{descBottomTxt}</p>}
      </div>
      <div className="content">{children}</div>
    </AreaBoxWrap>
  );
};
