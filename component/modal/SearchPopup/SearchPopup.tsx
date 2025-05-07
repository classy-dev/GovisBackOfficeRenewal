import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import CheckBoxGroup from '@ComponentFarm/modules/CheckBoxGroup/CheckBoxGroup';
import Modal from '@ComponentFarm/modules/Modal/Modal';
import RadioGroup from '@ComponentFarm/modules/RadioGroup/RadioGroup';
import { Badge } from '@ComponentFarm/atom/Badge/Badge';
import CheckBox from '@ComponentFarm/atom/Checkbox/CheckBox';
import Radio from '@ComponentFarm/atom/Radio/Radio';
import { IOption, Select } from '@ComponentFarm/atom/Select/Select';
import { TableWrap } from '@ComponentFarm/common';
import SearchKeyword from '@ComponentFarm/template/common/FilterTable/SearchKeyword';
import { SelectConfig } from '@UtilFarm/convertEnvironment';
import { SearchBox, SearchResult } from '../searchPopup_style';

type ColumnNameType = {
  th: string[];
  col: number[];
};

type selectOptionsType = {
  [key: string]: string | null;
};

export type checkedItemType = {
  idx: string;
  name: string;
};

export interface ICommonResultData {
  idx: number;
  label: string;
}

interface SearchPopupProps<T extends ICommonResultData> {
  width?: number;
  title: string;
  className?: string;
  searchBoxPlaceHolder?: string;
  keyWordSearchTitle: string;
  selectConfig?: SelectConfig[];
  tableCofig: ColumnNameType;
  resultData: T[];
  type?: string;
  disabled?: boolean;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  filters: selectOptionsType;
  setFilters: Dispatch<SetStateAction<selectOptionsType>>;
  initialValues: string[];
  selectItems: checkedItemType[];
  setSelectItems: Dispatch<SetStateAction<checkedItemType[]>>;
  badge: string[];
  defaultKeyword?: {
    search_target: string;
    search_keyword: string;
  };
  searchTargetOptions?: { value: string; label: string }[];
  customFilter?: React.ReactNode;
}

const SearchPopup = <T extends ICommonResultData>({
  width = 833,
  title,
  className,
  searchBoxPlaceHolder,
  keyWordSearchTitle,
  selectConfig,
  tableCofig,
  resultData,
  type,
  disabled = false,
  isOpen,
  setIsOpen,
  filters,
  setFilters,
  initialValues,
  selectItems,
  setSelectItems,
  badge,
  defaultKeyword = {
    search_target: '',
    search_keyword: '',
  },
  searchTargetOptions,
  customFilter,
}: SearchPopupProps<T>) => {
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const resetSearchState = () => {
    // 검색 관련 상태 초기화
    setKeyword({
      search_target: searchTargetOptions?.[0]?.value || '',
      search_keyword: '',
    });
    setFilters(prev => ({
      ...prev,
      search_target: searchTargetOptions?.[0]?.value || null,
      search_keyword: null,
    }));
  };

  const onFormSubmit = () => {
    const selectedProducts = resultData
      .filter((item: T) => checkedItems.includes(String(item.idx)))
      .map((item: T) => ({ idx: String(item.idx), name: item.label || '' }));

    const filterSelectItems = selectItems?.filter(item =>
      checkedItems.includes(item.idx)
    );

    const combineItems = [...filterSelectItems, ...selectedProducts].reduce(
      (accumulator: checkedItemType[], currentItem) => {
        if (!accumulator.some(item => item.idx === currentItem.idx)) {
          accumulator.push(currentItem);
        }
        return accumulator;
      },
      []
    );

    setSelectItems(combineItems);
    resetSearchState();
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handlerClose = () => {
    resetSearchState();
    setIsOpen(false);
  };

  // value를 string으로 변환하는 헬퍼 함수
  const getStringValue = (value: IOption | string | null): string | null => {
    if (typeof value === 'string') return value;
    if (!value) return null;
    return String(value.value);
  };

  // filter
  const handleFilterChange = (
    field: string,
    value: IOption | string | null
  ) => {
    const stringValue = getStringValue(value);

    if (field === 'search_target') {
      // 검색 대상이 변경되면 검색어도 초기화
      setKeyword({
        search_target: stringValue || '',
        search_keyword: '',
      });
      setFilters(prev => ({
        ...prev,
        search_target: stringValue,
        search_keyword: null,
      }));
      return;
    }

    // 나머지 필드들 업데이트
    setFilters(prev => ({
      ...prev,
      [field]: stringValue,
    }));
  };

  const [reorderedArray, setReorderedArray] = useState<T[]>([]);

  useEffect(() => {
    const selectIdxs = new Set(selectItems.map(item => item.idx));
    const selectedItems: T[] = [];
    const remainingItems: T[] = [];

    resultData.forEach((item: T) => {
      if (selectIdxs.has(String(item.idx))) {
        selectedItems.push(item);
      } else {
        remainingItems.push(item);
      }
    });

    setReorderedArray([...selectedItems.reverse(), ...remainingItems]);
  }, [selectItems, resultData]);

  const renderTable = () => {
    return (
      <div className="table-list">
        <ul>
          <li className="list-header">
            <div style={{ width: `${tableCofig.col[0]}px` }}>
              {type !== 'radio' && (
                <CheckBox value="allChkHandler" label="All" />
              )}
            </div>
            {tableCofig.th.map((el, i) => (
              <div key={i} style={{ width: `${tableCofig.col[i + 1]}px` }}>
                {el}
              </div>
            ))}
          </li>
        </ul>
        <div className="list-content">
          <ul>
            {reorderedArray?.map((el: T) => (
              <li key={el.idx} className="list-item">
                <div style={{ width: `${tableCofig.col[0]}px` }}>
                  {type === 'radio' ? (
                    <Radio value={el.idx} label={el.label} />
                  ) : (
                    <CheckBox value={String(el.idx)} label={el.label} />
                  )}
                </div>
                {Object.entries(el).map(
                  ([key, value], index) =>
                    key !== 'idx' && (
                      <div
                        key={index}
                        style={{ width: `${tableCofig.col[index]}px` }}
                      >
                        {key === 'status' ? (
                          <Badge
                            color={
                              value === badge[0]
                                ? 'green'
                                : value === badge[badge.length - 1]
                                ? 'red'
                                : 'yellow'
                            }
                            size="sm"
                            dot
                          >
                            {String(value)}
                          </Badge>
                        ) : key === 'category' ? (
                          <label htmlFor={String(el.idx)}>
                            {String(value)}
                          </label>
                        ) : (
                          String(value)
                        )}
                      </div>
                    )
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const modalType = () => {
    const commonProps = {
      name: 'chkSelectItem',
      disabled,
    };

    const allOptions = resultData?.map((item: T) => ({
      value: String(item.idx),
      label: item.label,
    }));

    if (type === 'radio') {
      return (
        <RadioGroup
          {...commonProps}
          defaultValue={String(...initialValues)}
          onChange={(data: string) => setCheckedItems([data])}
        >
          <>{renderTable()}</>
        </RadioGroup>
      );
    }

    return (
      <CheckBoxGroup
        {...commonProps}
        initialCheckedValues={initialValues}
        allChechkHandler={allOptions}
        onChange={setCheckedItems}
      >
        <>{renderTable()}</>
      </CheckBoxGroup>
    );
  };

  return (
    <Modal
      title={title}
      isOpen={isOpen}
      onClose={handlerClose}
      onCancel={handlerClose}
      showCloseButton
      addStyles={css`
        max-width: unset;
        overflow-y: unset;
      `}
      onFormSubmit={onFormSubmit}
    >
      <SearchBox width={width} className={className}>
        <fieldset>
          <legend>{title} 검색</legend>
          <table>
            <tbody>
              {selectConfig && (
                <tr>
                  <th scope="row">필터</th>
                  <td>
                    {customFilter || (
                      <div className="wrap_input">
                        {selectConfig?.map(el => (
                          <Select
                            key={el.field}
                            options={el.options}
                            selectedOption={filters[el.field]}
                            setSelectedOption={option =>
                              handleFilterChange(el.field, option)
                            }
                            prefixLabel={el.label}
                            placeholder="전체"
                          />
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              )}
              <tr>
                <th scope="row">{keyWordSearchTitle}</th>
                <td>
                  <div
                    css={css`
                      display: flex;
                      gap: 0.8rem;
                      align-items: center;

                      .search-target-select {
                        min-width: 120px;

                        .select_library_control {
                          height: 4rem;
                          min-height: 4rem;
                        }
                      }
                    `}
                  >
                    {searchTargetOptions && (
                      <div
                        className="search-target-select"
                        css={css`
                          height: 4rem;
                          min-height: 4rem;
                        `}
                      >
                        <Select
                          options={searchTargetOptions}
                          selectedOption={filters.search_target}
                          setSelectedOption={option =>
                            handleFilterChange('search_target', option)
                          }
                          placeholder="검색 대상"
                        />
                      </div>
                    )}
                    <SearchKeyword
                      keyword={keyword}
                      setKeyword={setKeyword}
                      handler={keywordConfig => {
                        handleFilterChange(
                          'search_keyword',
                          keywordConfig.search_keyword
                        );
                      }}
                      placeholder={
                        searchBoxPlaceHolder ?? '검색어를 입력해 주세요'
                      }
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </fieldset>
      </SearchBox>
      <SearchResult width={width} col={tableCofig.col}>
        <TableWrap>{modalType()}</TableWrap>
      </SearchResult>
    </Modal>
  );
};

export default SearchPopup;
