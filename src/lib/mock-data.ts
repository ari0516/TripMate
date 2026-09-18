import type {
  Expense,
  OpeningHours,
  Place,
  Schedule,
  TravelDocument,
  Trip,
} from "./types";

/** 모든 요일에 동일한 영업시간을 적용하는 헬퍼 */
function everyday(open: string, close: string): OpeningHours {
  return {
    mon: [open, close],
    tue: [open, close],
    wed: [open, close],
    thu: [open, close],
    fri: [open, close],
    sat: [open, close],
    sun: [open, close],
  };
}

export const mockTrips: Trip[] = [
  {
    id: "trip-1",
    name: "도쿄 여행",
    country: "일본",
    startDate: "2026-10-12",
    endDate: "2026-10-16",
    dailyBudget: 100000,
    emoji: "🇯🇵",
  },
  {
    id: "trip-2",
    name: "방콕 여행",
    country: "태국",
    startDate: "2026-11-01",
    endDate: "2026-11-05",
    dailyBudget: 80000,
    emoji: "🇹🇭",
  },
];

export const mockPlaces: Place[] = [
  {
    id: "place-1",
    tripId: "trip-1",
    name: "센소지",
    category: "관광지",
    address: "일본 도쿄도 다이토구 아사쿠사",
    openingHours: everyday("06:00", "17:00"),
    closedDays: [],
    mapUrl: "https://maps.google.com/?q=Sensoji",
    blogUrl: "https://blog.naver.com/",
    photos: [
      "places/ChIJ8T1GpMGOGGARDYGSgpooDWw/photos/AVoNoXQGj2OF2vg1IJbdtphO-YswYW_i_HhSW0hIINJsM1bZ1Lf8R4_crAwLxZ5vXONnAckiInItc6YM1PrZ7SMKRNBJIn3r8FP-CTcDouK_Y5UAKw4eZHKXyIGOVhh047aA2vXi_gM1Q_k-jwZgQfk61AF2-UWz3hp-UeCTj7lzB7BXtVHDed5OAAMJ1QyuGKHSdv2nvIlvDeMnj7HYIxPtUmC3hNm0WsQhx3cTtnPCEI9qK6I3buqPdav4ER1riP8ZM5KBzc3W2EvVpgX6y6LvP6cbFy3gAmRZc6QBYJYHIz5zpRVDx6GUcc_CTvKO7Ie44T4APdyWccLO7CAHUssbSiUrv7lO4fpvGmpSBxijvPgxDdJd2_gMGs8q26RPNk4ZXTPTKUVItm46usrDpjY53zS_TujbFNHVJOxNSerM_nb-DdQJ",
      "places/ChIJ8T1GpMGOGGARDYGSgpooDWw/photos/AVoNoXRoXwTmTZCoTkgl-tKVTlmN6Mj3MUT2JDdJ2ifN0PysbCjO0d_r03mxWnZ9nbj_nf_rZjV34RyOB1iFYI0OU8yyfQpV73IGOyFhM2DkW3dXY2AgQJ7-6z_tQ3vUTEoNtED_pCIWm60FQgBqS0keLIn909tiGwlr6VyGSWHA_sldCKy5B0qavDVbyWl11o6tRIfQXEsuIUP5WzNUzTLggjz7k5eSevikKwaKD0puJ7JsdNTMJpmYCEV7NkmXxYo5weFL-h66Aay_HgsgkfqFl6pN34NTrSkg9UFghCE0WkjD8qkeUEwzKaoh5x7q-2yT3Or7FreZqIcu7AOB22EYaYTzj5m7PP8xHG1_MsO5_LsmCcNipD_d7UD9CK2l5ntrgFxZlljE6b18PH9GJtlMU4euTVoqNwwIDXJaKy1aX-ahQbc",
      "places/ChIJ8T1GpMGOGGARDYGSgpooDWw/photos/AVoNoXRClb3vxdsjxCAof7edEmiN9tvTMuN_C2RzB2_Z3QVWG_GMQdFwFO9g6vgMGUzgXPMai3VIJR3aVzH9EcaRWJaonBb9NIld5_WFTSJET4aiEoZTG79qbOoWbLOB5Xxa3nsT4rhMIh7VTEVgHrUOvTpz-UXWH31lBLrbZtso2KS1p-qqvuLgg2KbRornTd2eOn43L_-21RTpBOgjA5aSQ3Bvr5JU5xUJ4ZtT_SZMcvKFII7R8Qrk9w5mfLM3DlyxgRtpeF8kB_X6XqhJJ4H4wVknunv72sfum_dYZlTjiJ_E4s026_jGwAq8Ts3H-5oFD9PAvHU-F-zJUmIuGAC_HxAIDbDygvehqRnD5pOP0KFzzcOgnJre2xNT0htrmhahpjS4MycyJsEDZ57eg3r2yYQm6iNxZrykMBA3Pj96n8T8Nv6t29LfiYbRRNniHn5j",
    ],
  },
  {
    id: "place-2",
    tripId: "trip-1",
    name: "멘야무사시",
    category: "맛집",
    address: "일본 도쿄도 신주쿠구",
    openingHours: everyday("11:00", "22:00"),
    closedDays: [],
    mapUrl: "https://maps.google.com/?q=Menya+Musashi",
    photos: [
      "places/ChIJcyLiKtaMGGARGlb3Io-Rf3w/photos/AVoNoXQ1CYb2cADvAIOm_rdEJqUAo5uhNiorU9mekE9btbIOYdIcIFPuYpf8NOEYtIj5Uc0ot0EgVnfE0GC6e_OfwxiMFH4sbdCJlIztBEfcpnKpsJWCuFe0cfWmLzlSRurfKfBk9L2ZPD6eKBTLFMpN9ONHYVUGMavpop27sK4nxeclojB56ge0tV2fgYbCY-XKaxgBWaeimLEOvC6AGBGicDrn502V7U2d8WtEeXaRK5rx55U0cIaiRO0qz7LNM_d0-uGW69iHMpLbsMmuNzfjbIh5s5AZRjTsbYmfgQV6iAsfXMnVj6IbdS_2kYYQGK9CGsUcW8Nd_pzps-wPcZunl_g0WXVp15nuTzY5_EmGmeIVdIFTt0VFBfKNRU0M0xnqU6bAe4mgDoV7KhOzZIjpbITXmdc",
      "places/ChIJcyLiKtaMGGARGlb3Io-Rf3w/photos/AVoNoXRmUqQ--u3c6gcQS5ccRuorcBw7qoU2V6BXT5uB9EiClOyHDcY4dQQh0AnUO-YeyYwQ91dWtlDlhlxLIHTR-dxrHldZk5EV3kriQ7BDHq3kw29W-gyXb4_9dehZdcAiOHFQXiAngiw_UQJdk0DCdTEjZZePG0Fp78mn51ZbkvGRePsUbuK-9Kgs3F7MaV0b2YqlxuYAwWV-YQ0TsiWyNy47Ua8U0komWJU3OjRag_C-nvYUAhjV4CcGPs7J9btcuj5lbU6HFaJ22mmissN11q0QiuoLahyV7J2AxpJDiu8yW83hMC_oq2k5JEM1mB23unw9Tz3i0e-1B1CpU8chtjudESK2tPrvmITF_2oXgTko2761nxB4xYhTXG7MXeL5UIRAg8LxRln6P2n9brT6kEklAcB7bXY",
      "places/ChIJcyLiKtaMGGARGlb3Io-Rf3w/photos/AVoNoXTXsfVXcNHm1HomULbedl8K7ymLzJws_k6L7Sjkimkdk0VsSQUl_SBebqIdATaRO5JgpDQwR_neWF4XMBuU4aYUZXv0xldbuFBIack0oP3P-Y5LcCqSGwCYe4bgrTaNwgJWCQgqB2DNoWD9TvgUKcPeUaC7JQHOwXzP8ec4m_nCwCPRLe7BXXL3hsDDMMlCQfMOVZlBNIlKW-HUiZ2D2BaOvVi4C-4bU4EL8fMl86mprTrsPHxJ-0OH_AoXNJqoW20AxMwH_PKDUeXHjKj8nDMAO1aeElbcGcjSNubac9OM8Xw4DPZLF-rCCzty6gh6UJF3cYhiZuWNR4hK29VemDoBX3vmWVYz6C5VW58m4nlvfk9GhrkGMeNtrsfJ9MmXzBlFkaFOdpz0IxAXTsv7TUdHVexueqcGJ_h4prHskguKwA",
    ],
  },
  {
    id: "place-3",
    tripId: "trip-1",
    name: "Blue Bottle Coffee 시부야",
    category: "카페",
    address: "일본 도쿄도 시부야구",
    openingHours: everyday("08:00", "14:00"),
    closedDays: ["wed"],
    mapUrl: "https://maps.google.com/?q=Blue+Bottle+Shibuya",
    blogUrl: "https://blog.naver.com/",
    photos: [
      "places/ChIJiXocb7WNGGAReVVBhRwWLoQ/photos/AVoNoXSipHHbqzRiv8zEqAmhvzmDyr37Yki5TCTgtXo_efSyTPwza6jF9r66_BEIhGooefLy8S8pYxYI0SyGpjPQ_AncKPlsCvI8EXDza9l7tmgQfkXgMoo161ijO8hqba3RTj2IwPmyJnT8LRoYk3bHJ0keVFHELJDpUDWDM7fAJmjdIuACk-FvMkY9epSSJl0sagY--0GE95neLE99xsebeOni1rEXLgrGr6TbmqzTl0jOoqhAoCDBFIiGiPcQJXuJjt8AHZgXGoPHbnfI2IPHgF4RaC2yHSsY4Vmqx1CW-umcgUNdhWEsco7Kq9FTT92rTt3htXCy8yjI5TCAEtyf9OK4fCJfjEx5ar--kBRoxVxi1vRr4Qyd0Ag5zMnP2sFZNqEQ6_5dZ-Ce9YkqCYtPTvam7kKaKsuSub6hyLBVnG7pgQ",
      "places/ChIJiXocb7WNGGAReVVBhRwWLoQ/photos/AVoNoXSXBYG77FztHdSPmRD_-zcF7nlN8DKHRslgx1Iumze8Jw7FwDE-i-yx1U5hVqLzwqYry4rgpEkxmN1MokXzv5s7IXcOuXmWyMGtGDjsX5nVHWsOOI0eQqyxCeXH-ZfqoUjtfdgriPxnV0_MBWNjO_2ieGvacCEiA3xYoysabqcUka3BVAbuAvOAWntvJGkti602RNV2xQ4vCRhU-WOgCZ3F9dq693KpsGWv9GZH3hfXgF4XVViOQz5DKkIUbMYeHVZfH3rH_GcRIZ2ECL3qXui3ACb1H585RWjQt1yD2wDiuXyFOw6icf39NKlL15mciHp7tG_qG1QPocRJdnHLfmB4kklfJwqAvEOgZZJSdLH7UgGaW4lLH0CDmRByYYqiCQ6KQgYPIkScwpa7Uj15KcHq1iF1ApNdcHc2C39u9M8iHw",
      "places/ChIJiXocb7WNGGAReVVBhRwWLoQ/photos/AVoNoXTFia4sjSHSnog0nbn-JKGlagCdcp6kD0MTHHLETE1OYm4dSB8BWMMlMlBcPt4EL4rRbp7MWKLrjhPeL2t0WO8zVUXHAW2dK5r91ypGwXWLsrUmJtcpmWAvH8XWRO_SAviwWC_Rp8KH1d67OIn3PzpGt7EiLiWgLMQVGKoJQrFGqfKgo5HVyay_J06l15NZIgdgASMyfW4FotZ9WwOvxNW1FafDv7BNIxQa6bR1qf9ZSveH2NxlrNWnB9A78UMEXCYNti_6b__CjshI9e3y4wW4vWwGYJTpL_KZP4KkNPWuj4Ad1Gv7xaNdQ4Ym6pC7RYTRiaragGDMqyeN0_eKdJxz99b3wc27d_Mp5rS308NUION2i0CYXR8Afwgc650Mf-HNQeG_TbDmRI1YdqO-iANL2NMZMrHIc2L-9nOI6-kH",
    ],
  },
  {
    id: "place-4",
    tripId: "trip-1",
    name: "긴자 식스",
    category: "쇼핑",
    address: "일본 도쿄도 주오구 긴자",
    openingHours: everyday("10:30", "20:30"),
    closedDays: [],
    mapUrl: "https://maps.google.com/?q=Ginza+Six",
    photos: [
      "places/ChIJAQAsR--LGGAR_AmB8WMDy88/photos/AVoNoXTK_ZxvnGf1HwVqDJINmAnNRcKtfdT8o1jm8pG7YCVYT3W6ymqwvIsczTXcvEcaNHBpmgt9QYcUi00bFchqpYgATEKaJt580ePQVMkjdWW2vXt8HbKXwv_6UiDip9Ljgq0WN22DH_-3v-eLOj7QA4PgnwbaBr5IETboF6OG10gJTIIJOPz7Rdu-EVLvGAqkYTy_Fpmnpxpwx-fBuW7iSyABj3v4hmi5SFbCWFJrlwPalTXdRJkH88LlIPp1-X-K0MIBkkzVbJwoecivIvlO49h0B17f0e7-9Lt1UDlC9BXSnyvsmoRaZI3IzS1I7jXpLTZKEe9bmP0OlZI3efyatMMnIVApJhoGmulM_i11R2yCO_8BmIS00_Ro09sqmPqxrv7N8Cr6isKh5cKBdrRtVsG0BnvAjYI_IeqwxWaGIIlnpg",
      "places/ChIJAQAsR--LGGAR_AmB8WMDy88/photos/AVoNoXRARbfG6CDYA2osiov9rVtYsAr2gKMbcazW-J_O5j1LjAbzhk_ZIVM_o5FV7vRPF2zZlVDgqvV4P5keJ-ZhdRx3XxlkaJFiusTdcn-LTtsh5lZRrFgru3MB3Bdv-wb32dTG-T4CloOZ_M4i5mjqDMQKVFeamGn_I9P9KjNcG7lBkuSC2OTcOUjhGR8yW6vwK3ct3PvLd_Zshzkke2L7CHenlnzJuvlxv699UJswJbG1bPEvJne3wX7g4Z_N-Vnu1EbBx4FhKE_A3WtkHQ0vnbpzXNvBob5AzytvoDRsxYsTq2-DV746dxKYDIO0PL5vEV68B8sLYUG5mAxLQ66Mm_Npdx4pWnLbP-N-W2sTBMVw7kCXfl5ya9WiOig-5kstJMuWBANeor4CMUaGWWBCuHKz5OHtptTm5ss2SIYOB7gc0g",
      "places/ChIJAQAsR--LGGAR_AmB8WMDy88/photos/AVoNoXQ0kKIK8VnftTpphoFLf2mHD5OkMUuq-Sx5o3ocmZgOTJL5tLc8iPpGaaK4Sz_ntFuRDVKZkunM3lOnv9DkoVqm5SG4bw3uhdWF8Cm0519Uj2QLVDmqIKtgNHbz0VdjGQ3iNBEdp4ckwy0IZnHhrlfu0bJirG_sdosers6EOMf65rl3DwLVGD_8s-sNOubBlq1a-UzQYQqgnZd9s2zC4Rxlr1D9bABNG5zMPuZibcdtrCuRkjjRGRBOsODOzgxqMOyLeCOcTyfVQ2X-5A3QxfG3b7qXj3u6APmF8dtREJrGWGEn_E0GKJAVTPOMnPKu9Rn8Q7WFeM4wMs-glZfUL0qobwbHPyq2NOd7fE_1RFDkL21BL3kCoeBQB65_E15EtBxclHZIsSC-O98vF2X9D1o2EmVt",
    ],
  },
  {
    id: "place-5",
    tripId: "trip-1",
    name: "시부야 스카이",
    category: "관광지",
    address: "일본 도쿄도 시부야구 시부야 스크램블 스퀘어",
    openingHours: everyday("10:00", "22:30"),
    closedDays: [],
    photos: [
      "places/ChIJ4Rr2JWiLGGARcyRSHuZ-9G8/photos/AVoNoXTnI7kQLaAufX7ZUPTPMCJXsCT_P1xvHjsPzK_sxMzTfhIb7BzIjlGt-S49x-LcKp_mq_APC-hH4Kcb_S8vH7DLrxVc4kqIILrs0aXZS7kJJeIo9AIjVqzlIehHQjOGtL-sSDBFd44fVp3-jXNUHFtOW2_f2K7g_PJY9KybXA-DEGhVRM7FVlt00QKrBKMoRELDPd2pjquOzKOow1BXlLXuPad7YElzTgWO57gvv6VBwXMrUYHY7SCi3Dc1XTjkuZiThQR4kqhv8hX7lhBFFUMDUdxwFHqvplp4FtVwKyqwcf1WMqGXsWwN6E0eLbxTtkneiV7EB__7ZiouiZYuxp7rNyOiKjQA9dJcy8ddHNCazW6EiwUtk7yEMsHdNgQXr4qSScRI9doMNoTymmj2FIcg5ZfORVFqY2GwEir2RTqJew",
      "places/ChIJ4Rr2JWiLGGARcyRSHuZ-9G8/photos/AVoNoXSaQ68zIGLU_8GZgnV-wFz6O8GJL0HsWQ3EjSsYZP9E6WKgaqnrK0amtJQ1LuZK-2YkbyDItgacuIVym1ZJi1SnAOWEVXCDBlBw0RsqkrE4CyjHZNOVETX0K7bAYMPLu-QH_a1gVSqq5yyZhg6NR__b5F54U8zTGb2RoKf1YxVJw1HwTjaVTAPlmmWNuP61pDfICA9I9ltK9g9_xS5k4IRRZvzFd9aNpIHJGeBJmZ7bZ6ZTH7ToURGn3RNpeJm7U95YPF7_jhg1D5QdlAsZJcjsn0badeDfFtISV7FPTnzEkINlEr6b5DAbtOyOa-vIa4WBi1d2kNeQC_AzrN_wx8Xt1C4kpoNmNxJHoNbMR8DqpRBLxhAHkuQCTDn5WpfFeiiPnc_GZCtvn6U47l6kYPz5hH4G3eRx3s4mmCmKMJo",
      "places/ChIJ4Rr2JWiLGGARcyRSHuZ-9G8/photos/AVoNoXRunSz3HN6-3zZvkivd4mWqTRe2uLg0CqIRBRO4vAYr6M5WmoIxi0eSaTdbKgXxnegnLTHNUgzk3PT1iBkdqA9F7Xa-ZBzYLlDYPPnWwbmJArYlzwAK29kqe-xLC3CWqNlMGju9w1_A8pfIEzhmARkiEClNaoCYFUvzRX_FDwzvthppYfW5dRfZqepQRSTeA4XuosxG3dH1sb714HX_rieV5kKg5Ik6Ccxr6-NZZmBB9nfh3Tr6jIWmloRW2yH2dT40igmJjl7HYA87G49QjcKzX_nTSc8LDcpe7tCPrUB6a3T21djinXU2HFfJA95m7jmEJghWKA2DkxSZTmF17A45-TuCj3LVJqGn3a6HWHQ7FVlSJOUTiVDUwXWS7_wDJZjAsX3q6vdZNt450RmET4koGAfB-bJM9VdYJCQLs0yz1CFO",
    ],
  },
  {
    id: "place-6",
    tripId: "trip-1",
    name: "호텔 그레이서리 신주쿠",
    category: "숙소",
    address: "일본 도쿄도 신주쿠구 가부키초",
    openingHours: {},
    closedDays: [],
    photos: [
      "places/ChIJF-U1JdiMGGARaay7KIrrtZ0/photos/AVoNoXTzMhucUcF2ghzY0SQtHlE3CftHELa3yzim8yg4duK10wxV259sQyVqQuxFEPJ7Zh3e44i4kL961QGAgTUttFloPxPno82Qe-ABApSv7c0zoOgr83XyuRbO_eqB9XXk-b2hJ_s9LnBhgCPGzVyzL93D8DiyQGVsYk6OUrAQMBGpeQeNIlyeDeArzwwUbRV1wTsmr67MziyOXUycpGYy7b-k84kW29QBoLajPtcRDpkFlZtzgp41099ZTX7z-38LFT9wr4MVj8CM-03V4Pi0h4cXla75g3OTB33m__lW4VFPvjWi3LjMx0TP6CLBHtDF3BIMHNxlMPuBYKr5cSsz5JUE5rESpZ5MtiTCBGkeI8mya2SrP2RFJ1fFZIUBw2KHEXGJs8N8X8Wp93xlxFhXxFdWZkg",
      "places/ChIJF-U1JdiMGGARaay7KIrrtZ0/photos/AVoNoXTKYz1NxWZbnXvT6Q8No-X6_QS9_Z5r-dUJkmQJKlZCxTbXGhowOXRRw5fivCIwkycDVJfq00xoFXEFV9rJ2F4--mRMzwHDOvkvrbc5Z1Ll2OVZQNSdjZvQtcqlok4WIlNCq6ppJCHn64a_6ZoHeN32sytP96SKENBCAvr0FBN5ZoNO-hVM5Q5g80u_mObeTi-imF1-3IM0iHhSl9-Y3SvtoALp8C_cdYD3P_TlY7XD0uy8gkw_5plx5jZ4teByaO-CkXuDddrcSa4IIfDrqJVaBbyV74vSdb3dY-p5Gux5owoz4Up-WEtd_EWAsMAenk-X3DgR5kDKs2cH2gRT-KZKOIMF1QW1tPS1ea8pYf3_vWvnFTmgBtqnKEwZS39166mTYD3BA-Mt3Cn4o_3SQdcWSNJzfsjMGrhqhRYqVhvDVA",
      "places/ChIJF-U1JdiMGGARaay7KIrrtZ0/photos/AVoNoXSbccpHov33gFsdSRFNSbPBD8Gz_AGsfzAUJXtVzU1I-vJdU-t2MkU46inJnCBzgLuaic6K7xMFjXyHSwfBNX1OxGL_qLeyhbt3euwj7IHWRpO__BvZYEXFhRI8GnMpuJTe6qzqdd-oCEMPg-Jf0OKrtIBChxxINndnaHsVNPkHBXQMAF2Of5D5e964LESm8QJIDq-02FvWtkR4W6uYlnDy-PvmeXSxYslbjngQxOtp5BkcX8IOwim7e7txy9QGsQlwdHjUoPc2vtudlPVJcHcDDnLXk7Ht7AS_gf2rqEq-i2oE8vFNL9nFEEnMl6hsnaGTVqr0Z3EfsSOoFUaO1FcZQYGBYvuwSzvQ5g37X-wqEuR9f7DLUHQSJcxwJ-c3BS0hf2n5DaNkIjXStBRAecX1Z1XB_WkUHEVTRMcP8Zrw",
    ],
  },
  {
    id: "place-7",
    tripId: "trip-2",
    name: "왓 아룬",
    category: "관광지",
    address: "태국 방콕 방콕야이",
    openingHours: everyday("08:00", "18:00"),
    closedDays: [],
    mapUrl: "https://maps.google.com/?q=Wat+Arun",
    photos: [
      "places/ChIJaSv_6gaZ4jARnbiUVn6Z_YY/photos/AVoNoXQqFPokZjDu8HQbLVD67Oc7-IZqmtMZrIjWbJgV177UmZHdoRjp0h8BWUDOQ6cPbI3mRr5H3tjEJ6gjxiIgQq7wEG8b0ma9yN1AWAYz65EiiiBST6yqz6oVNZVrMpuWuwFCy_ca7HD1aK57e8nzFIE6gWzrG7vs-LR86fe8aqgeZWmOcPqqNcxYpc_Wohr-4i_oYcHToxRgLhiSUZJGDq8xrYYxLwL40oXgqUl_SzP4MrNHKRzKN889-FFOgn2IT-m8y5U5hl02zbzHGIeZhYVJPzJMesX3cjMRygodPw0vgCWbhQ82pJYJO5FKpsrXAkKm2od36kr7mq3hOYeX-GTjEmAh2KF9qtgASOexb-okIqnKYJKNSn95CLzItefvetltXVvzgnNQW7LPbTy9ZtmN5pS8v3mumHb8YwDWTHp18uzF",
      "places/ChIJaSv_6gaZ4jARnbiUVn6Z_YY/photos/AVoNoXQ60ibJy139jcX8iDXLzcGo71DerghbJSPiEeEQuZWFwlRalqK4jfA4FQQqlO279hQnvQeRONmuSTFhdqDegYKeS_-rX4VOkSVqoI-RxgwlLyTGS6dYi5XK7MOGaOVdGioid2HWB4jrCuTq2HFLOTQbXJ2Dv__FF25piNLqX2GMhJG2mVnkaRGt8ENKoUyNDlWVwibl6MKIQbJBi0iTWvobl96FLqwOUkO5-ztR3DnMNMvcDBTF-F6ePsGCiUVtTqm-c_shiGx1pqFppDJAMBAUujg5xMMHspniDLp-IO0y0XdmpayHXE78BnkQHhck06nBMndx-5qMueq0dcaTBV5t-e1pdgZfsw1tL7pgXnH0uanldaMw1u_d2sZhIXfUxkRiqO2bjo4uQWXtYllfEPeTQPVicLP7mvYQ0SmVZCC59Zg",
      "places/ChIJaSv_6gaZ4jARnbiUVn6Z_YY/photos/AVoNoXQf4Xzb2u5ogT_I0SBhgaUgp48cYhPLdn6C5HCm8DL_Y61-TzucYn2s8VSSkRuLgQ1a7rskg4VNAEmLuZ2Cyc7kIF5lxFmIJYnjGZNYOx3qVg8U9vkIQncdP2raVJpxNT4yMb2XEa2usDhLKGa8oAekXwLwlNLjsRLWMFX2T6xTZJSGUZIfHMoCekUXKi6rQyaLISarOSqHy9hi_OY2IPlipjeVQB6-G0a-3Woga0QeS0RTdXXn_imhlo_sxexo605ZUW1eH_OjF6FvThKpGFw6xfYTCrcnNqSrRq4Ert5fvUJciU-pWCF_WMZlellZ2LXHOVMGMSJV_ZCQN5a6_cvNOm_uewnmFJjBEun2SYa8UY-lNqtcwzcH9vRC_f6K-Ked89NqhdUxIQ80c_ZUBjWPwBhHKmO5L8M7Tw2i0IobNQ",
    ],
  },
];

export const mockSchedules: Schedule[] = [
  {
    id: "sch-1",
    tripId: "trip-1",
    placeId: "place-1",
    date: "2026-10-12",
    startTime: "10:00",
    endTime: "11:30",
  },
  {
    id: "sch-2",
    tripId: "trip-1",
    placeId: "place-2",
    date: "2026-10-12",
    startTime: "12:30",
    endTime: "13:30",
  },
  {
    id: "sch-3",
    tripId: "trip-1",
    placeId: "place-3",
    date: "2026-10-12",
    startTime: "15:00",
    endTime: "16:00",
  },
  {
    id: "sch-4",
    tripId: "trip-1",
    placeId: "place-5",
    date: "2026-10-13",
    startTime: "09:30",
    endTime: "11:00",
  },
  {
    id: "sch-5",
    tripId: "trip-1",
    placeId: "place-4",
    date: "2026-10-13",
    startTime: "13:00",
    endTime: "15:00",
  },
];

/** Phase 2 (가계부)에서 사용할 초기 데이터 */
export const mockExpenses: Expense[] = [
  {
    id: "exp-1",
    tripId: "trip-1",
    date: "2026-10-12",
    amount: 18000,
    category: "식비",
    memo: "점심 라멘",
  },
  {
    id: "exp-2",
    tripId: "trip-1",
    date: "2026-10-12",
    amount: 5000,
    category: "교통",
    memo: "지하철",
  },
  {
    id: "exp-3",
    tripId: "trip-1",
    date: "2026-10-12",
    amount: 49000,
    category: "쇼핑",
    memo: "기념품",
  },
];

/** 서류함(티켓·쿠폰·입국심사 서류) 초기 데이터 — MVP는 빈 상태로 시작한다 */
export const mockDocuments: TravelDocument[] = [];
