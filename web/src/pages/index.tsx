import Head from "next/head";
import {Inter} from "next/font/google";
import Table from "react-bootstrap/Table";
import {Alert, Container} from "react-bootstrap";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {useState} from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"


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

const rowsPerPage = 20;
const [startIndex, setStartIndex] = useState(0);
const [endIndex, setEndIndex] = useState(rowsPerPage);


const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(20);
const lastItemIndex = currentPage * itemsPerPage;
const firstItemIndex = lastItemIndex - itemsPerPage;
const currentItems = users.slice(firstItemIndex, lastItemIndex);
let pages = [];
for (let i = 0; i <= Math.ceil(users.length / itemsPerPage); i+=itemsPerPage) {
  pages.push(i);
}

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
  <PaginationContent>
    <PaginationItem>
      <PaginationLink
        className={startIndex === 0 ? "pointer-events-none opacity-50" : undefined}
        href="#"
        onClick={() => {
        setCurrentPage(1);
      }}>начало</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink
        href="#"
        onClick={() => {
        handlePrevPage();
      }}>назад</PaginationLink>
    </PaginationItem>

    {pages.map((page,idx) =>  (
      <PaginationItem key={idx}
        className={currentPage === page ? "bg-neutral-100 rounded-md" : undefined}
      >
        <PaginationLink href="#" onClick={() => {
          setStartIndex(page);
          setEndIndex(page + rowsPerPage);
        }}>{idx + 1}</PaginationLink>
      </PaginationItem>
    ))}
    <PaginationItem>
      <PaginationLink
        href="#"
        onClick={() => {
        handleNextPage();
      }}>вперед</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink
        className={endIndex === 0 ? "pointer-events-none opacity-50" : undefined}
        href="#"
        onClick={() => {
          setCurrentPage(pages.length - 1);
      }}>конец</PaginationLink>
    </PaginationItem>

  </PaginationContent>
</Pagination>

          {/*TODO add pagination*/}

        </Container>
      </main>
    </>
  );
}
