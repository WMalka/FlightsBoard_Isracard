using AutoMapper;
using FlightBoard.Core.Entities;
using FlightBoard.Services.DTOs;

namespace FlightBoard.Services.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Flight, FlightDto>();
            CreateMap<CreateFlightDto, Flight>();
        }
    }
}