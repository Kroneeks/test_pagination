import Head from "next/head";
import {Inter} from "next/font/google";
import Table from "react-bootstrap/Table";
import {Alert, Container} from "react-bootstrap";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {useState, useEffect, useRef} from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import Image from "next/image";
import ChevronLeft from "@/assets/icons/chevron-left.svg";
import ArrowLeft from "@/assets/icons/arrow-left.svg";
import ChevronRight from "@/assets/icons/chevron-right.svg";
import ArrowRight from "@/assets/icons/arrow-right.svg";


const inter = Inter({subsets: ["latin"]});

type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TGetServerSideProps = {
  statusCode: number
  users: TUserItem[]
}

export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  try {
    const res = await fetch("http://localhost:3000/users", {method: 'GET'})
    if (!res.ok) {
      return {props: {statusCode: res.status, users: []}}
    }

    return {
      props: {statusCode: 200, users: await res.json()}
    }
  } catch (e) {
    return {props: {statusCode: 500, users: []}}
  }
}) satisfies GetServerSideProps<TGetServerSideProps>


export default function Home({statusCode, users}: TGetServerSideProps) {
const initialized = useRef(false)

const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(20);
const pagesCount = Math.ceil(users.length / itemsPerPage);
const [pages, setPages] = useState([]);
const [startIdx, setStartIdx] = useState(0)

const lastItemIndex = currentPage * itemsPerPage;
const firstItemIndex = lastItemIndex - itemsPerPage;
const currentItems = users.slice(firstItemIndex, lastItemIndex);
const paginationLimit = 10;

useEffect(() => {
  if (!initialized.current) {
    initialized.current = true
    const localPages = new Array(pagesCount);
    for (let i = 0; i < localPages.length; i++) {
      localPages[i] = i + 1;
    }
    setPages(oldPages => [...oldPages, ...localPages]);
  }
}, [])

useEffect(() => {
  setStartIdx(Math.max(0, Math.min(Math.floor(currentPage-1-paginationLimit/2), pages.length-paginationLimit)))
}, [currentPage])

const handleNextPage = () => {
  if (currentPage < pages.length) {
    setCurrentPage(currentPage + 1);
  }
}

const handlePrevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
}

  if (statusCode !== 200) {
    return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>
  }

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={inter.className}>
        <Container>

          <h1 className={'mb-5'}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Дата обновления</th>
            </tr>
            </thead>
            <tbody>
            {
              currentItems.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))
            }
            </tbody>
          </Table>

        <Pagination>
  <PaginationContent className="flex flex-row list-none">
    <PaginationItem
        className={`rounded-l-sm ${currentPage <= 1 && "pointer-events-none opacity-50"}`}
        onClick={() => {
        setCurrentPage(1);
      }}><Image src={ChevronLeft} alt="В начало" />
    </PaginationItem>
    <PaginationItem
        className={currentPage <= 1 ? "pointer-events-none opacity-50" : undefined}
        onClick={() => {
        handlePrevPage();
      }}><Image src={ArrowLeft} alt="Назад" />
    </PaginationItem>

    {pages.slice(startIdx, startIdx + paginationLimit).map((page,idx) =>  (
      <PaginationItem key={idx}
        className={currentPage === page && "bg-cyan-600 text-white"}
          onClick={() => {
            setCurrentPage(page);
          }}
      >
          {page}
      </PaginationItem>
    ))}
    <PaginationItem
        className={currentPage >= pages.length ? "pointer-events-none opacity-50" : undefined}
        onClick={() => {
        handleNextPage();
      }}
    >
      <Image src={ArrowRight} alt="Вперед" className="fill-yellow-700" />
    </PaginationItem>
    <PaginationItem
        className={`rounded-r-sm ${currentPage >= pages.length && "pointer-events-none opacity-50"}`}
        onClick={() => {
          setCurrentPage(pages.length);
        }}
    >
      <Image src={ChevronRight} alt="В конец" />
    </PaginationItem>

  </PaginationContent>
</Pagination>
        </Container>
      </main>
    </>
  );
}
