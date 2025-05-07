import { useState, useEffect, SyntheticEvent, ReactElement } from 'react';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { runInAction } from 'mobx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import styled from '@emotion/styled';
import { fetchMyInfo, fetchMyPermissions, fetchlogin } from '@ApiFarm/auth';
import { ServerError } from '@InterfaceFarm/response';
import { Button } from '@ComponentFarm/atom/Button/Button';
import { authStore, confirmModalStore } from '@MobxFarm/store';
import { errorHandler } from '@UtilFarm/error-handler';

const LoginWrap = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background: #f7f7fe;

  h1 {
    width: 32.4rem;
    margin: 0 auto 4rem;

    img {
      display: inline-block;
      width: 100%;
      max-width: 306px;
    }
  }

  form {
    width: 38rem;
    padding: 6.4rem 6.4rem 0;
    box-sizing: content-box;

    legend {
      display: block;
      margin-bottom: 3rem;
      color: #5a6376;
      text-align: center;
      font-size: 2.4rem;
      font-style: normal;
      font-weight: 700;
      line-height: 110%;
    }

    .box_login {
      &:first-of-type {
        margin-bottom: 3.1rem;
      }
      label {
        margin-bottom: 0.9rem;
        color: #5a6376;
        font-size: 1.6rem;
        font-style: normal;
        font-weight: 600;
        line-height: 120%;
      }
      input {
        height: 5rem;
        padding-left: 1.6rem;
        border: 1px solid #e5e5e5;

        &::placeholder {
          color: var(--color-neutral70);
        }
      }
    }

    button[type='submit'] {
      width: 100%;
      height: 5.5rem;
      margin: 3rem 0;
      font-size: 1.7rem;
      border-radius: 0.4rem;
    }

    .copyright {
      display: flex;
      align-items: center;
      padding-top: 8rem;
      color: var(--color-blue_gray50);
      font-size: 1.2rem;
      font-style: normal;
      font-weight: 400;
      line-height: 2rem;

      button {
        padding: 0.8rem;
        font-size: 1.2rem;
        border-radius: 0.4rem;
        background: none;
        cursor: pointer;

        &:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      }
      .txt {
        margin-left: auto;
      }
    }
  }
`;

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginState, setIsLoginState] = useState(-1);

  // 로그인에 따른 화면 전환
  useEffect(() => {
    if (authStore.isLoggedIn) {
      setIsLoginState(1);
      // router.push('/dashboard');
    } else {
      setIsLoginState(0);
    }
  }, [router]);

  useEffect(() => {
    window.addEventListener(
      'message',
      function (event) {
        if (event.origin !== 'https://dev.govis.gopizza.kr') return;

        const { token } = event.data;
        console.log('event.data.token', event.data.token);
        if (token) {
          authStore.login(token);
        }
      },
      false
    );
  }, []);

  // 로그인 후 permission
  useQuery(['my-permission'], () => fetchMyPermissions(), {
    // eslint-disable-next-line consistent-return
    onSuccess: (data: any) => {
      if (data.permission.length === 0) {
        return authStore.logOut();
      }

      runInAction(() => {
        authStore.permissionList = data.permission;
        authStore.is_staff = data.is_staff;
      });
    },
    onError: () => authStore.logOut(),
    enabled: !!authStore.isLoggedIn,
  });

  // 로그인 핸들링
  const handleLogin = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const tokenData = await fetchlogin({
        email,
        password,
      });

      const authData = await fetchMyInfo(tokenData['GO-AUTH']);

      const cookieData = { ...authData };
      const chkhost =
        typeof window !== 'undefined' ? window?.location?.host : null;

      if (
        cookieData.permission &&
        Array.isArray(cookieData.permission.perm_list)
      ) {
        cookieData.permission.perm_list = cookieData.permission.perm_list.map(
          (item: any) => ({ perm_code: item.perm_code })
        );
      }

      Cookies.set(
        'AUTH_DATA',
        JSON.stringify({
          token: tokenData['GO-AUTH'],
          ...cookieData,
        }),
        {
          secure: true,
          domain:
            chkhost?.indexOf('localhost') !== -1
              ? undefined
              : chkhost?.indexOf('dev.govis') !== -1
              ? '.dev.govis.gopizza.kr'
              : '.gopizza.kr',
          sameSite: 'none',
          path: '/',
        }
      );

      runInAction(() => {
        authStore.login({
          token: tokenData['GO-AUTH'],
          ...authData,
        });

        router.push('/sales-analyze');
      });
    } catch (error: unknown) {
      const { code, message } = error as ServerError;
      errorHandler(code, message);
      // errorHandler(error);
      // console.log('e', error);
    }
  };

  if (isLoginState === -1) {
    return <div />;
  }

  if (isLoginState !== -1 && isLoginState !== 0) {
    router.push('/sales-analyze');
  }

  const confirmModal = () => {
    runInAction(() => {
      confirmModalStore.openModal({
        title: '이용안내',
        content: (
          <p className="txt_login">
            본 서비스는 외부에 공개되지 않은 &quot;(주)고피자&quot; 본사
            임직원들을 위한 내부 서비스입니다. 계정관련 문의는 미래기술연구소에
            문의해 주세요.
          </p>
        ),
        showCloseButton: true,
        showButtons: false,
      });
    });
  };

  return (
    <>
      <Head>
        <title>로그인 | GOVIS</title>
      </Head>
      {isLoginState === 0 ? (
        <LoginWrap>
          <div className="inner">
            <h1 className="logo">
              <img
                src="/images/common/logo_govis_login.png"
                alt="GOVIS - GO BEYOND WITH OUR VISION"
              />
            </h1>

            <form className="login_form" onSubmit={handleLogin}>
              <legend>로그인</legend>
              <fieldset>
                <div className="box_login">
                  <label htmlFor="email">아이디</label>
                  <input
                    type="email"
                    id="email"
                    className="inp"
                    placeholder="이메일"
                    value={String(email)}
                    autoComplete="username"
                    onChange={event => setEmail(event.target.value)}
                  />
                </div>
                <div className="box_login">
                  <label htmlFor="pw">비밀번호</label>
                  <input
                    className="inp"
                    type="password"
                    id="pw"
                    value={password}
                    placeholder="비밀번호"
                    autoComplete="current-password"
                    onChange={event => setPassword(event.target.value)}
                  />
                </div>
                <div className="login__action">
                  <Button type="submit" variant="primary">
                    로그인
                  </Button>
                </div>
              </fieldset>
              <div className="copyright">
                <button type="button" onClick={confirmModal} className="info">
                  이용 안내
                </button>
                <span className="txt">
                  Copyright {dayjs().year()}. GOPIZZA. All rights reserved.
                </span>
              </div>
            </form>
          </div>
        </LoginWrap>
      ) : (
        <div />
      )}
    </>
  );
};

export default Login;

Login.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <div className="app__wrapper">{page}</div>
    </>
  );
};
